import {HeatmapOptions} from './HeatmapOptions.jsx';
import {svgHorizontalLineIcon} from './icons.js';
import {svgVerticalLineIcon} from './icons.js';
import {svg2DTilesIcon} from './icons.js';
import {svg2DHeatmapIcon} from './icons.js';
import {svg1DAxisIcon} from './icons.js';
import {svgVertical1DAxisIcon} from './icons.js';
import {svgGeneAnnotationsIcon} from './icons.js';
import {svgVerticalGeneAnnotationsIcon} from './icons.js';
import {svg1DTilesIcon} from './icons.js';
import {svgVertical1DTilesIcon} from './icons.js';
import {svgArrowheadDomainsIcon} from './icons.js';

import {format, formatPrefix, precisionRound, precisionPrefix} from 'd3-format';

let localServer = "localhost:8000";
let remoteServer = "52.45.229.11";
//export const usedServer = localServer;
export const usedServer = remoteServer;

export const optionsInfo = {
    minusStrandColor:  {
        name: "- Strand Color",
        inlineOptions: {
            'red': { name: "Red", value: "red"},
            'blue': { name: "Blue", value: "blue"},
            'green': { name: "Green", value: "green"},
            'grey': { name: "Grey", value: "grey"},
            'black': { name: "Black", value: "black"}
        }
    },
    plusStrandColor:  {
        name: "+ Strand Color",
        inlineOptions: {
            'red': { name: "Red", value: "red"},
            'blue': { name: "Blue", value: "blue"},
            'green': { name: "Green", value: "green"},
            'grey': { name: "Grey", value: "grey"},
            'black': { name: "Black", value: "black"}
        }
    },
    oneDHeatmapFlipped: {
        name: 'Flip Heatmap',
        inlineOptions: {
            'yes': { name: 'Yes', value: 'yes' },
            'no': { name: 'No', value: null }
        }
    },
    axisPositionHorizontal: {
        name: "Axis Position",
        inlineOptions: {
            'left': { name: 'Left', value: 'left' },
            'right': { name: 'Right', value: 'right' },
            'hidden': { name: 'Hidden', value: null }
        }
    },
    axisPositionVertical: {
        name: "Axis Position",
        inlineOptions: {
            'left': { name: 'Top', value: 'top' },
            'right': { name: 'Bottom', value: 'bottom' },
            'hidden': { name: 'Hidden', value: null }
        }
    },
    labelPosition: {
        name: "Label Position",
        inlineOptions: {
            'tl': { name: "Top left", value: 'topLeft' },
            'tr': { name: 'Top right', value: 'topRight' },
            'bl': {name: "Bottom left", value: 'bottomLeft' },
            'br': {name: "Bottom right", value: 'bottomRight' },
            'hidden': {name: "Hidden", value: 'hidden'}
        }
    },

    // colormaps are mostly taken from here:
    // http://matplotlib.org/api/pyplot_summary.html?highlight=colormaps#matplotlib.pyplot.colormaps
    colorRange: {
        name: "Color map",
        inlineOptions: {
            'default': { name: 'default', value: [
                                          "#FFFFFF",
                                          "#F8E71C",
                                          "rgba(245,166,35,1)",
                                          "rgba(0,0,0,1)"
                                       ]},
            'afmhot': { name: 'afmhot', value: ['rgba(0, 0, 0, 1.0)', 'rgba(128, 0, 0, 1.0)', 'rgba(256, 129, 1, 1.0)', 'rgba(256, 256, 129, 1.0)', 'rgba(256, 256, 256, 1.0)'] },
            'hot': { name: "hot", value: ['rgba(10, 0, 0, 1.0)', 'rgba(179, 0, 0, 1.0)', 'rgba(256, 91, 0, 1.0)', 'rgba(256, 256, 6, 1.0)', 'rgba(256, 256, 256, 1.0)'] },
            'jet': { name: "jet", value: ['rgba(0, 0, 128, 1.0)', 'rgba(0, 129, 256, 1.0)', 'rgba(125, 256, 122, 1.0)', 'rgba(256, 148, 0, 1.0)', 'rgba(128, 0, 0, 1.0)'] },

            'bwr': { name: 'bwr', value: ['rgba(0, 0, 256, 1.0)', 'rgba(128, 128, 256, 1.0)', 'rgba(256, 254, 254, 1.0)', 'rgba(256, 126, 126, 1.0)', 'rgba(256, 0, 0, 1.0)'] },
            'cubehelix': { name: 'cubehelix', value: ['rgba(0, 0, 0, 1.0)', 'rgba(21, 83, 76, 1.0)', 'rgba(162, 121, 74, 1.0)', 'rgba(199, 180, 238, 1.0)', 'rgba(256, 256, 256, 1.0)'] },
            'rainbow': { name: 'rainbow', value: ['rgba(128, 0, 256, 1.0)', 'rgba(0, 181, 236, 1.0)', 'rgba(129, 255, 180, 1.0)', 'rgba(256, 179, 96, 1.0)', 'rgba(256, 0, 0, 1.0)'] },

            'gray': { name: "greys", value: ['rgba(255,255,255,1)', 'rgba(0,0,0,1)'] },
            'red': { name: "White to red", value: ['rgba(255,255,255,1)', 'rgba(255,0,0,1)'] },
            'green': { name: "White to green", value: ['rgba(255,255,255,1)', 'rgba(0,255,0,1)'] },
            'blue': { name: "White to blue", value: ['rgba(255,255,255,1)', 'rgba(0,0,255,1)'] },
            'custom': {
                name: "Custom...",
                componentPickers: {
                    'heatmap': HeatmapOptions
                }
            }
        }
    },

    maxZoom: {
        name: "Zoom limit",
        inlineOptions: {
            'none': { name: "None", value: null },
        },
        generateOptions: track => {
            if (track.maxZoom) {
                let formatter = format('.0s');
                let inlineOptions = [];

                for (let i = 0; i <= track.maxZoom; i++) {
                    let maxWidth = track.maxWidth;
                    let binsPerDimension = track.binsPerDimension;
                    let maxZoom = track.maxZoom;

                    let resolution = track.maxWidth / (2 ** i * track.binsPerDimension)

                    let maxResolutionSize = maxWidth / (2 ** maxZoom * binsPerDimension);
                    let minResolution = maxWidth / binsPerDimension;

                    let pp = precisionPrefix(maxResolutionSize, resolution);
                    let f = formatPrefix('.' + pp, resolution);
                    let formattedResolution = f(resolution);

                    //let formattedName =  ;
                    inlineOptions.push({
                        'name': formattedResolution,
                        value: i.toString()
                    });

                    //
                }

                return inlineOptions;
            } else
                return [];
        }
    }
}

export const tracksInfo = [
    {
        type: 'left-axis',
        datatype: ['axis'],
        local: true,
        orientation: '1d-vertical',
        name: 'Left Axis',
        thumbnail: svgVertical1DAxisIcon,
        minWidth: 100
    },
    {
        type: 'top-axis',
        datatype: ['axis'],
        local: true,
        orientation: '1d-horizontal',
        name: 'Top Axis',
        thumbnail: svg1DAxisIcon,
        defaultOptions: {}
    },
    {
        type: 'heatmap',
        datatype: ['matrix'],
        local: false,
        orientation: '2d',
        thumbnail: svg2DHeatmapIcon,
        defaultOptions: {
            labelPosition: 'bottomRight',
            colorRange: [
                              "#FFFFFF",
                              "#F8E71C",
                              "rgba(245,166,35,1)",
                              "rgba(0,0,0,1)"
                           ],
            maxZoom: null
        },
        availableOptions: [ 'labelPosition', 'colorRange', 'maxZoom' ]
    },
    {
        type: 'horizontal-heatmap',
        datatype: ['matrix'],
        local: false,
        minHeight: 50,
        orientation: '1d-horizontal',
        thumbnail: svg2DHeatmapIcon,
        defaultOptions: {
            labelPosition: 'bottomRight',
            colorRange: [
                              "#FFFFFF",
                              "#F8E71C",
                              "rgba(245,166,35,1)",
                              "rgba(0,0,0,1)"
                           ],
            maxZoom: null
        },
        availableOptions: [ 'labelPosition', 'colorRange', 'maxZoom', 'oneDHeatmapFlipped' ]
    },
    {
        type: 'vertical-heatmap',
        datatype: ['matrix'],
        local: false,
        minWidth: 50,
        orientation: '1d-vertical',
        thumbnail: svg2DHeatmapIcon,
        defaultOptions: {
            labelPosition: 'bottomRight',
            colorRange: [
                              "#FFFFFF",
                              "#F8E71C",
                              "rgba(245,166,35,1)",
                              "rgba(0,0,0,1)"
                           ],
            maxZoom: null
        },
        availableOptions: [ 'labelPosition', 'colorRange', 'maxZoom', 'oneDHeatmapFlipped' ]
    },
    {
        type: 'horizontal-line',
        datatype: ['vector'],
        local: false,
        orientation: '1d-horizontal',
        thumbnail: svgHorizontalLineIcon,
        availableOptions: [ 'labelPosition', 'axisPositionHorizontal' ],
        defaultOptions: {
            labelPosition: 'topLeft',
            axisPositionHorizontal: 'right'
        }
    },
    //
    {
        type: 'vertical-line',
        datatype: ['vector'],
        local: false,
        orientation: '1d-vertical',
        thumbnail: svgVerticalLineIcon,
        availableOptions: [ 'labelPosition', 'axisPositionVertical' ],
        defaultOptions: {
            labelPosition: 'bottomLeft',
            axisPositionVertical: 'top'
        }
    },
    {
        type: '2d-tiles',
        datatype: ['matrix'],
        local: false,
        orientation: '2d',
        name: '2D Tile Outlines',
        thumbnail: svg2DTilesIcon
    },
    {
        type: 'top-stacked-interval',
        datatype: ['stacked-interval'],
        local: false,
        orientation: '1d-horizontal',
        thumbnail: 'horizontal-stacked-interval.png',
        availableOptions: [ 'labelPosition' ]
    },
    {
        type: 'left-stacked-interval',
        datatype: ['stacked-interval'],
        local: false,
        orientation: '1d-vertical',
        thumbnail: 'vertical-stacked-interval.png',
        availableOptions: [ 'labelPosition' ]
    },
    {
        type: 'viewport-projection-center',
        datatype: ['2d-projection'],
        local: true,
        hidden: true,
        orientation: '2d',
        name: 'Viewport Projection',
        thumbnail: 'viewport-projection-center.png'
    },

    {
        type: 'horizontal-gene-annotations',
        datatype: ['gene-annotation'],
        local: false,
        minHeight: 60,
        orientation: '1d-horizontal',
        name: 'Gene Annotations',
        thumbnail: svgGeneAnnotationsIcon,
        availableOptions: [ 'labelPosition', 'plusStrandColor', 'minusStrandColor' ]
    },
    {
        type: 'vertical-gene-annotations',
        datatype: ['gene-annotation'],
        local: false,
        minWidth: 60,
        orientation: '1d-vertical',
        name: 'Gene Annotations',
        thumbnail: svgVerticalGeneAnnotationsIcon,
        availableOptions: [ 'labelPosition' ]
    },
    {
        type: 'arrowhead-domains',
        datatype: ['arrowhead-domains'],
        local: false,
        orientation: '2d',
        name: 'Arrowhead Domains',
        thumbnail: svgArrowheadDomainsIcon,
        availableOptions: [ 'labelPosition' ]
    },

    {
        type: 'combined',
        datatype: 'any',
        local: true,
        orientation: 'any'
    }
    ,
    {
        type: '2d-chromosome-grid',
        datatype: ['chromosome-2d-grid'],
        local: true,
        orientation: '2d',
        name: 'Chromosome Grid (hg19)',
        chromInfoPath: "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv",
        thumbnail: null
    }
    ,
    {
        type: '2d-chromosome-labels',
        datatype: ['chromosome-2d-labels'],
        local: true,
        orientation: '2d',
        name: 'Chromosome Axis (hg19)',
        chromInfoPath: "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv",
        thumbnail: null
    }
    ,
    {
        type: '2d-chromosome-annotations',
        local: true,
        orientation: '2d',
        name: '2D Chromosome Annotations',
        thumbnail: null,
        selectable: false
    }
    ,
    {
        type: 'horizontal-chromosome-labels',
        datatype: ['chromosome-1d-labels'],
        local: true,
        orientation: '1d-horizontal',
        minHeight: 30,
        name: 'Chromosome Axis (hg19)',
        chromInfoPath: "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv",
        thumbnail: null
    }
    ,
    {
        type: 'vertical-chromosome-labels',
        datatype: ['chromosome-1d-labels'],
        local: true,
        orientation: '1d-vertical',
        minWidth: 30,
        minHeight: 30,
        name: 'Chromosome Axis (hg19)',
        chromInfoPath: "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv",
        thumbnail: null
    }
    ,
    {
        type: 'vertical-1d-tiles',
        datatype: ['1d-tiles'],
        local: false,
        orientation: '1d-vertical',
        name: 'Vertical 1D Tile Outlines',
        thumbnail: svgVertical1DTilesIcon
    },
    {
        type: 'horizontal-1d-tiles',
        datatype: ['vector', 'stacked-interval', 'gene-annotation'],
        local: false,
        orientation: '1d-horizontal',
        name: 'Horizontal 1D Tile Outlines',
        thumbnail: svg1DTilesIcon
    }
]

export const TILE_FETCH_DEBOUNCE = 100;
// Number of milliseconds zoom-related actions (e.g., tile loading) are debounced
export const ZOOM_DEBOUNCE = 100;

let temp = {};

tracksInfo.forEach(t => {
    temp[t.type] = t;
})

export const tracksInfoByType = temp;

// the length of time to keep refreshing the view after
// a drag event
export const SHORT_DRAG_TIMEOUT = 110;
export const LONG_DRAG_TIMEOUT = 1000;

export const LOCATION_LISTENER_PREFIX = 'locationListenerPrefix';
