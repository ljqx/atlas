import Promise from 'bluebird';

export default {
  parameters: {
    MeasureGlobal: { default: undefined },
    time: { default: { start: '2017-11-01', end: '2017-12-02' } },
    virtualRoot: { default: undefined },
  },
  cells: {
    measureGlobal: {
      dependencies: [],
      factory: () => Promise.resolve({
        defaultValue: 'UU',
        enums: ['Revenue', 'UU', 'TransactionCount'],
      }),
    },
    bestUser: {
      dependencies: ['MeasureGlobal', 'time'],
      factory: (MeasureGlobal, time) => Promise.resolve({ data: { data: { Department: 'STC', Discipline: 'DEV' }, metric: MeasureGlobal, time } }),
    },
  },
  id: 10000,
};