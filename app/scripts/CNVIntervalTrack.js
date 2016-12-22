import {scaleBand} from 'd3-scale';
import {range} from 'd3-array';
import {HorizontalTiled1DPixiTrack} from './HorizontalTiled1DPixiTrack.js';

export class CNVIntervalTrack extends HorizontalTiled1DPixiTrack {
    constructor(scene, server, uid) {
        super(scene, server, uid);

        //console.log('CNVInterval:', this);
        this.seen = new Set();
    }

    uid(item) {
        return item[item.length-2];
    }

    segmentsToRows(segments) {
        /**
         * Partition a list of segments into an array of
         * rows containing the segments.
         *
         * @param segments: An array of segments (e.g. [{from: 10, to: 20}, {from: 18, to: 30}])
         * @return: An array of arrays of segments, representing 
         *          non-overlapping rows of segments
         */
        let rows = [];

        //segments should be returned sorted from the server
        segments.sort((a,b) => { return a.from - b.from; })

        // fill out each row with segments
        for (let i = 0; i < segments.length; i++) {
            let placed = false;
            let currSegment = segments[i];

            // go through each row and each if we can place the current
            // segment in that row
            for (let j = 0; j < rows.length; j++) {
                // can we place this segment in this row?
                let rowSegment = rows[j][rows[j].length-1];

                if ((currSegment.from < rowSegment.from && rowSegment.from < currSegment.to ) ||
                    (currSegment.from < rowSegment.to && rowSegment.to < currSegment.to))
                    continue; //overlap

                
                rows[j].push(currSegment);
                placed = true;
            }

            if (!placed) 
                rows.push([currSegment])
        }

        return rows;
    }

    redraw(tile) {
        tile.graphics.clear();
        let seen = new Set();

        let segments = tile.tileData.discrete
            .map((x) => {
                if (seen.has(this.uid(x)))
                    return null;
                seen.add(this.uid(x));
                console.log('length:', +x[2] - +x[1])
                return  {'from': +x[1],
                         'to': +x[2],
                         'type': x[4],
                         'uid': this.uid(x)}
            })
            .filter(x => x); //filter out null values


        let rows = this.segmentsToRows(segments);
        tile.rows = rows;

        let valueScale = scaleBand().rangeRound([0, this.dimensions[1]]).padding(0.1)
        .domain(range(0, this.maxRows()));  // draw one away from the center

        let graphics = tile.graphics;

        graphics.lineStyle(1, 0x0000FF, 1);
        graphics.beginFill(0xFF700B, 1);

        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                let x1 = this._refXScale(rows[i][j].from);
                let x2 = this._refXScale(rows[i][j].to);

                let y1 = valueScale(i)
                let y2 = y1 + valueScale.bandwidth();

                let width = x2 - x1;
                let height = y2 - y1;

                //console.log('x1', x1, 'x2:', x2, 'width:', width, 'height:', height);


                graphics.drawRect(x1, y1, width, height);
            }
        }
    }


    initTile(tile) {
        this.redraw(tile);
    }

    maxRows() {
        let visibleAndFetchedIds = this.visibleAndFetchedIds();

        let max = Math.max.apply(null,
            visibleAndFetchedIds.map(x => {
                //console.log('ft:', this.fetchedTiles[x]);
                if ('rows' in this.fetchedTiles[x])
                    return this.fetchedTiles[x].rows.length;
                return 0;
            }));

        return max;
    }

    updateTile(tile) {
        this.redraw(tile);
    }

    destroyTile(tile) {
        tile.tileData.discrete.map((x) => {
            let uid = x[x.length-2];

            if (this.seen.has(uid))
                this.seen.delete(uid);
        });
    }

    drawTile(tile) {
        //let {tileX, tileWidth} = this.getTilePosAndDimensions(tile.tileData.zoomLevel, tile.tileData.tilePos);

        //console.log('tileX:', tileX, 'tile:', tile);
    }
}
