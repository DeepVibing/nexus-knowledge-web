import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Share2,
  Filter,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { useGraphData, useGraphSearch, useInfluentialEntities } from '../hooks/useKnowledgeGraph';
import { useToast } from '../contexts/ToastContext';
import type {
  GraphNodeDto,
  GraphParams,
} from '../types';
import { ENTITY_TYPE_COLORS, DEFAULT_ENTITY_COLOR } from '../types/knowledgeGraph';

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
  description?: string;
  connectionCount: number;
  communityId?: string;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  id: string;
  relationshipType: string;
  strength: number;
}

const ENTITY_TYPES = [
  'person', 'company', 'project', 'tool', 'concept', 'event', 'location', 'document', 'term',
];

export default function KnowledgeGraphPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNodeDto | null>(null);
  const [enabledTypes, setEnabledTypes] = useState<Set<string>>(new Set(ENTITY_TYPES));
  const [showFilters, setShowFilters] = useState(true);

  // Build filter params
  const graphParams: GraphParams = {};
  if (enabledTypes.size < ENTITY_TYPES.length) {
    graphParams.entityTypes = Array.from(enabledTypes);
  }

  const { data: graphData, isLoading } = useGraphData(workspaceId, graphParams);
  const { data: influential } = useInfluentialEntities(workspaceId, { limit: 10 });
  const graphSearch = useGraphSearch();
  const { error: showError } = useToast();

  // Convert API data to simulation-compatible format
  const buildSimData = useCallback(() => {
    if (!graphData) return { nodes: [] as SimNode[], links: [] as SimLink[] };

    const nodeMap = new Map<string, SimNode>();
    const nodes: SimNode[] = graphData.nodes.map((n) => {
      const simNode: SimNode = { ...n, x: undefined, y: undefined };
      nodeMap.set(n.id, simNode);
      return simNode;
    });

    const links: SimLink[] = graphData.edges
      .filter((e) => nodeMap.has(e.sourceId) && nodeMap.has(e.targetId))
      .map((e) => ({
        source: e.sourceId,
        target: e.targetId,
        id: e.id,
        relationshipType: e.relationshipType,
        strength: e.strength,
      }));

    return { nodes, links };
  }, [graphData]);

  // D3 rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !graphData) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    const { nodes, links } = buildSimData();
    if (nodes.length === 0) return;

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    zoomRef.current = zoom;
    svg.call(zoom);

    const g = svg.append('g');

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#3A3A3A');

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#2A2A2A')
      .attr('stroke-width', (d) => 1 + d.strength * 2)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', 'url(#arrowhead)');

    // Link labels
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('font-size', '8px')
      .attr('fill', '#666666')
      .attr('text-anchor', 'middle')
      .attr('dy', -4)
      .text((d) => d.relationshipType)
      .style('font-family', 'var(--font-mono)')
      .style('pointer-events', 'none')
      .attr('opacity', 0);

    // Node groups
    const node = g.append('g')
      .selectAll<SVGGElement, SimNode>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, SimNode>()
          .on('start', (event, d) => {
            if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulationRef.current?.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node circles
    node.append('circle')
      .attr('r', (d) => 10 + d.connectionCount * 2)
      .attr('fill', (d) => ENTITY_TYPE_COLORS[d.type] || DEFAULT_ENTITY_COLOR)
      .attr('fill-opacity', 0.8)
      .attr('stroke', '#0A0A0A')
      .attr('stroke-width', 2);

    // Node labels
    node.append('text')
      .attr('dy', (d) => 10 + d.connectionCount * 2 + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#A0A0A0')
      .attr('font-size', '10px')
      .style('font-family', 'var(--font-body)')
      .style('pointer-events', 'none')
      .text((d) => d.name.length > 25 ? d.name.slice(0, 22) + '...' : d.name);

    // Hover + click interactions
    node
      .on('mouseover', function (_event, d) {
        d3.select(this).select('circle')
          .attr('stroke', '#E80ADE')
          .attr('stroke-width', 3);
        // Show connected edge labels
        linkLabel
          .attr('opacity', (l) =>
            (l.source as SimNode).id === d.id || (l.target as SimNode).id === d.id ? 1 : 0
          );
        link.attr('stroke-opacity', (l) =>
          (l.source as SimNode).id === d.id || (l.target as SimNode).id === d.id ? 1 : 0.15
        );
      })
      .on('mouseout', function () {
        d3.select(this).select('circle')
          .attr('stroke', '#0A0A0A')
          .attr('stroke-width', 2);
        linkLabel.attr('opacity', 0);
        link.attr('stroke-opacity', 0.6);
      })
      .on('click', (_event, d) => {
        setSelectedNode({
          id: d.id,
          name: d.name,
          type: d.type,
          description: d.description,
          connectionCount: d.connectionCount,
          communityId: d.communityId,
        });
      });

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(120).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-400).distanceMax(500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))
      .on('tick', () => {
        link
          .attr('x1', (d) => (d.source as SimNode).x!)
          .attr('y1', (d) => (d.source as SimNode).y!)
          .attr('x2', (d) => (d.target as SimNode).x!)
          .attr('y2', (d) => (d.target as SimNode).y!);

        linkLabel
          .attr('x', (d) => ((d.source as SimNode).x! + (d.target as SimNode).x!) / 2)
          .attr('y', (d) => ((d.source as SimNode).y! + (d.target as SimNode).y!) / 2);

        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [graphData, buildSimData]);

  // Zoom controls
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.67);
    }
  };

  const handleFitToScreen = () => {
    if (svgRef.current && zoomRef.current && containerRef.current) {
      const svg = d3.select(svgRef.current);
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      svg.transition().duration(500).call(
        zoomRef.current.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8).translate(-width / 2, -height / 2)
      );
    }
  };

  // Search
  const handleSearch = async () => {
    if (!workspaceId || !searchQuery.trim()) return;
    try {
      await graphSearch.mutateAsync({
        workspaceId,
        data: { query: searchQuery.trim(), limit: 10 },
      });
    } catch {
      showError('Graph search failed');
    }
  };

  // Type filter toggle
  const toggleType = (type: string) => {
    setEnabledTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const stats = graphData?.stats;
  const hasData = graphData && graphData.nodes.length > 0;

  return (
    <div className="flex h-full -m-6">
      {/* Left Panel: Filters */}
      {showFilters && (
        <div className="w-56 flex-shrink-0 bg-[#141414] border-r border-[#2A2A2A] p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#666666]" style={{ fontFamily: 'var(--font-heading)' }}>
              Entity Types
            </h3>
          </div>

          <div className="space-y-1.5">
            {ENTITY_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={enabledTypes.has(type)}
                  onChange={() => toggleType(type)}
                  className="sr-only"
                />
                <div
                  className={`w-3 h-3 rounded-sm border transition-colors ${
                    enabledTypes.has(type)
                      ? 'border-transparent'
                      : 'border-[#3A3A3A] bg-transparent'
                  }`}
                  style={{
                    backgroundColor: enabledTypes.has(type)
                      ? ENTITY_TYPE_COLORS[type] || DEFAULT_ENTITY_COLOR
                      : undefined,
                  }}
                />
                <span className="text-sm text-[#A0A0A0] group-hover:text-[#F5F5F5] capitalize">
                  {type}
                </span>
              </label>
            ))}
          </div>

          {/* Stats */}
          {stats && (
            <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#666666] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Statistics
              </h3>
              <div className="space-y-2 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Nodes</span>
                  <span className="text-[#F5F5F5]">{stats.nodeCount}</span>
                </div>
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Edges</span>
                  <span className="text-[#F5F5F5]">{stats.edgeCount}</span>
                </div>
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Avg Degree</span>
                  <span className="text-[#F5F5F5]">{stats.averageDegree.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Components</span>
                  <span className="text-[#F5F5F5]">{stats.componentCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Top Influential Entities */}
          {influential && influential.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#666666] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Top Nodes
              </h3>
              <div className="space-y-1.5">
                {influential.slice(0, 5).map((entity) => (
                  <div
                    key={entity.id}
                    className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#1C1C1C] px-2 py-1 rounded-sm"
                    onClick={() =>
                      setSelectedNode({
                        id: entity.id,
                        name: entity.name,
                        type: entity.type,
                        connectionCount: entity.connectionCount,
                      })
                    }
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ENTITY_TYPE_COLORS[entity.type] || DEFAULT_ENTITY_COLOR }}
                    />
                    <span className="text-[#A0A0A0] truncate">{entity.name}</span>
                    <span className="text-[#666666] ml-auto" style={{ fontFamily: 'var(--font-mono)' }}>
                      {entity.score.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Graph Canvas */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2A] bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-medium tracking-wide text-[#F5F5F5]">Knowledge Graph</h1>
            {stats && (
              <span className="text-xs text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
                {stats.nodeCount} nodes / {stats.edgeCount} edges
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="w-64">
              <Input
                placeholder="Search graph..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearch}
              isLoading={graphSearch.isPending}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Graph Container */}
        <div ref={containerRef} className="flex-1 bg-[#0A0A0A] relative">
          {hasData ? (
            <svg ref={svgRef} className="w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <EmptyState
                icon={<Share2 className="h-6 w-6" />}
                title="No graph data"
                description="Extract entities from your sources to build the knowledge graph"
              />
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 flex gap-1">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-[#141414] border border-[#2A2A2A] rounded-sm text-[#A0A0A0] hover:text-[#F5F5F5] hover:border-[#3A3A3A] transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-[#141414] border border-[#2A2A2A] rounded-sm text-[#A0A0A0] hover:text-[#F5F5F5] hover:border-[#3A3A3A] transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleFitToScreen}
              className="p-2 bg-[#141414] border border-[#2A2A2A] rounded-sm text-[#A0A0A0] hover:text-[#F5F5F5] hover:border-[#3A3A3A] transition-colors"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Search Results Overlay */}
          {graphSearch.data && graphSearch.data.results.length > 0 && (
            <div className="absolute top-4 right-4 w-72 bg-[#141414] border border-[#2A2A2A] rounded-sm shadow-lg max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A2A2A]">
                <span className="text-xs font-semibold text-[#A0A0A0]">
                  {graphSearch.data.totalResults} results
                </span>
                <button
                  onClick={() => graphSearch.reset()}
                  className="text-[#666666] hover:text-[#F5F5F5]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              {graphSearch.data.results.map((result) => (
                <div
                  key={result.node.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#1C1C1C] cursor-pointer"
                  onClick={() => setSelectedNode(result.node)}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ENTITY_TYPE_COLORS[result.node.type] || DEFAULT_ENTITY_COLOR }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-[#F5F5F5] truncate">{result.node.name}</p>
                    <p className="text-xs text-[#666666] capitalize">{result.node.type}</p>
                  </div>
                  <span className="text-xs text-[#666666] ml-auto" style={{ fontFamily: 'var(--font-mono)' }}>
                    {(result.similarity * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Node Detail */}
      {selectedNode && (
        <div className="w-72 flex-shrink-0 bg-[#141414] border-l border-[#2A2A2A] p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#666666]" style={{ fontFamily: 'var(--font-heading)' }}>
              Node Detail
            </h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-[#666666] hover:text-[#F5F5F5]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Node name + type */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ENTITY_TYPE_COLORS[selectedNode.type] || DEFAULT_ENTITY_COLOR }}
                />
                <span className="text-xs text-[#A0A0A0] uppercase capitalize" style={{ fontFamily: 'var(--font-mono)' }}>
                  {selectedNode.type}
                </span>
              </div>
              <h4 className="text-lg font-medium text-[#F5F5F5]">{selectedNode.name}</h4>
            </div>

            {/* Description */}
            {selectedNode.description && (
              <div>
                <p className="text-xs font-semibold text-[#666666] uppercase mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  Description
                </p>
                <p className="text-sm text-[#A0A0A0]">{selectedNode.description}</p>
              </div>
            )}

            {/* Connections */}
            <div>
              <p className="text-xs font-semibold text-[#666666] uppercase mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                Connections
              </p>
              <span className="text-sm text-[#F5F5F5]" style={{ fontFamily: 'var(--font-mono)' }}>
                {selectedNode.connectionCount}
              </span>
            </div>

            {/* Community */}
            {selectedNode.communityId && (
              <div>
                <p className="text-xs font-semibold text-[#666666] uppercase mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  Community
                </p>
                <span className="text-xs text-[#A0A0A0]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {selectedNode.communityId}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
