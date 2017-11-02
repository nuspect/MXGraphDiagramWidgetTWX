import {mxgraph} from "./mxGraphImport"
import "./FlexArrowShape";
import {GraphCellRenderer} from './CellRenderer'

let mxGraph = mxgraph.mxGraph,
  mxShape = mxgraph.mxShape,
  mxRubberband = mxgraph.mxRubberband,
  mxClient = mxgraph.mxClient,
  mxUtils = mxgraph.mxUtils,
  mxCellTracker = mxgraph.mxCellTracker,
  mxStackLayout = mxgraph.mxStackLayout,
  mxLayoutManager = mxgraph.mxLayoutManager,
  mxConstants = mxgraph.mxConstants,
  mxEdgeStyle = mxgraph.mxEdgeStyle;
  
  let mxCellRenderer = mxgraph.mxCellRenderer;
  
window.onload = function () {
  // Program starts here. Creates a sample graph in the
  // DOM node with the specified ID. This function is invoked
  // from the onLoad event handler of the document (see below).
  // Program starts here. Creates a sample graph in the
  // DOM node with the specified ID. This function is invoked
  // from the onLoad event handler of the document (see below).
  function main(container) {
    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error('Browser is not supported!', 200, false);
    }
    else {
      // Creates the graph inside the given container
      var graph = new mxGraph(container);
      container.style.background = 'url("node_modules/mxgraph/javascript/examples/editors/images/grid.gif")';
      // Enables tooltips, panning and resizing of the container
      graph.setPanning(true);
      graph.setResizeContainer(true);
      graph.setTooltips(true);
      // disable new connections and cloning cells, as well as drag and drop outside
      graph.setConnectable(false);
      graph.setCellsCloneable(false);
      graph.setCellsDeletable(false);
      graph.setCellsEditable(false);
      graph.setDropEnabled(false);
      graph.setSplitEnabled(false);
      graph.graphHandler.removeCellsFromParent = false;
      graph.collapseToPreferredSize = false;
      graph.constrainChildren = false;
      graph.cellsSelectable = false;
      graph.extendParentsOnAdd = false;
      graph.extendParents = false;
      graph.border = 10;

      let graphRenderer = new GraphCellRenderer();

      new mxCellTracker(graph);
      // Enables crisp rendering of rectangles in SVG
      var style = graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = false;

      // create the supplier cell
      style = mxUtils.clone(style);
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
      style[mxConstants.STYLE_FONTSIZE] = 13;
      style[mxConstants.STYLE_STARTSIZE] = 22;
      style[mxConstants.STYLE_HORIZONTAL] = false;
      style[mxConstants.STYLE_FONTCOLOR] = 'black';
      style[mxConstants.STYLE_STROKECOLOR] = 'black';
      graph.getStylesheet().putCellStyle('supplier', style);

      // create the style for the part cell
      style = mxUtils.clone(graph.getStylesheet().getDefaultEdgeStyle());
      style[mxConstants.STYLE_STROKECOLOR] = 'black';
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
      graph.getStylesheet().putCellStyle('part', style);
      // Creates the default style for edges
      style = {
        "endArrow": "block",
        "edgeStyle": mxEdgeStyle.ElbowConnector,
        "strokeColor": 'black',
        "shape": "flexArrow",
        "fillColor": "#B3FF66",
        "width": "4",
        "endSize": "4.42",
        "endWidth": "11",
      };
      graph.getStylesheet().putDefaultEdgeStyle(style);
      // Installs a custom tooltip for cells
      graph.getTooltipForCell = graphRenderer.getCellTooltip;
      graph.isLabelClipped = graphRenderer.isLabelClipped;

      // Installs auto layout for all levels
      var layout = new mxStackLayout(graph, true);
      layout.resizeParent = true;

      layout.border = graph.border;
      var layoutMgr = new mxLayoutManager(graph);
      layoutMgr.getLayout = function (cell) {
        if (!cell.collapsed) {
          if (cell.parent != graph.model.root) {
            layout.resizeParent = true;
            layout.horizontal = true;
            layout.spacing = 40;
          }
          else {
            layout.resizeParent = true;
            layout.horizontal = false;
            layout.spacing = 40;
          }

          return layout;
        }

        return null;
      };
      // Returns a html representation of the cell
      graph.getLabel = graphRenderer.getCellLabel;

      // Extends mxGraphModel.getStyle to show an image when collapsed
      var modelGetStyle = graph.model.getStyle;
      graph.model.getStyle = function (cell) {
        if (cell != null) {
          var style = modelGetStyle.apply(this, arguments);

          if (cell.style == 'supplier' && this.isCollapsed(cell)) {
            style = 'rectangle';
          }

          return style;
        }

        return null;
      };

      // Enables rubberband selection
      new mxRubberband(graph);

      // Adds a button to execute the layout
      document.body.appendChild(mxUtils.button('Arrange', function (evt) {
        var parent = graph.getDefaultParent();
        layout.execute(parent);
      }));
      // Gets the default parent for inserting new cells. This
      // is normally the first child of the root (ie. layer 0).
      var parent = graph.getDefaultParent();

      // Adds cells to the model in a single step
      graph.getModel().beginUpdate();
      try {
        var data = {
          'PlantName': 'Industrialesud GmbH',
          'Lft-Nr+ZA': '151573-12',
          'Ort / Land': 'Landau / DE',
          'Produktion': undefined,
          'Sequenzprod.': 'ja',
          'Teilefamilie': undefined,
          'Name': 'Himmel',
          'Variantenzahl': 'G30/F90: 18; F34/F36: 132',
          'BehälterTyp': '3104026',
          'Füllgrad': '6'
        };
        var supplier1 = graph.insertVertex(parent, null, 'Industrialesud GmbH / Landau / DE', 0, 0, 400, 250, 'supplier');

        var v1 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G30//F34/F36 H50' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        var v2 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel F34/F36/G30/G22/G82 H50' }, 0, 0, 200, 220, 'part');
        v1.collapsed = false;
        var supplier1 = graph.insertVertex(parent, null, 'Grupo Antolin Bohema A.S.  / Liberec / CZ / G31/ G32', 0, 0, 400, 250, 'supplier');
        var t = v1;
        var v22 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G31 / G32' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        graph.insertEdge(parent, null, 'test', v1, v22);
        graph.insertEdge(parent, null, 'test', v2, v22);

        var supplier1 = graph.insertVertex(parent, null, 'Industrialesud GmbH / Landau / DE', 0, 0, 400, 250, 'supplier');

        var v1 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G30//F34/F36 H50' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        var v2 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel F34/F36/G30/G22/G82 H50' }, 0, 0, 200, 220, 'part');
        v1.collapsed = false;
        var supplier1 = graph.insertVertex(parent, null, 'Grupo Antolin Bohema A.S.  / Liberec / CZ / G31/ G32', 0, 0, 400, 250, 'supplier');

        var v22 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G31 / G32' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        graph.insertEdge(parent, null, 'test', v1, v22);
        graph.insertEdge(parent, null, 'test', v2, t);

        var supplier1 = graph.insertVertex(parent, null, 'Industrialesud GmbH / Landau / DE', 0, 0, 400, 250, 'supplier');

        var v1 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G30//F34/F36 H50' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        var v2 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel F34/F36/G30/G22/G82 H50' }, 0, 0, 200, 220, 'part');
        v1.collapsed = false;
        var supplier1 = graph.insertVertex(parent, null, 'Grupo Antolin Bohema A.S.  / Liberec / CZ / G31/ G32', 0, 0, 400, 250, 'supplier');

        var v22 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G31 / G32' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        graph.insertEdge(parent, null, 'test', v1, v22);
        graph.insertEdge(parent, null, 'test', v2, t);
      }
      finally {
        // Updates the display
        graph.getModel().endUpdate();
      }
    }
  };


  main(document.getElementById('graphContainer'));
};
