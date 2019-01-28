const viewconfig = {
  editable: true,
  zoomFixed: false,
  trackSourceServers: ['//higlass.io/api/v1'],
  exportViewUrl: '/api/v1/viewconfs',
  views: [{
    uid: 'aa',
    initialXDomain: [0, 1000000],
    tracks: {
      top: [{
        type: 'dummy',
        uid: 'dummy'
      }],
      left: [],
      center: [],
      right: [],
      bottom: [],
      whole: [],
      gallery: []
    },
    layout: {
      w: 12,
      h: 12,
      x: 0,
      y: 0,
      i: 'aa',
      moved: false,
      static: false
    },
    initialYDomain: [1276863408.5778158, 1474332874.4920979]
  }]
};

export default viewconfig;
