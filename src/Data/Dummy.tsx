import { ITimeline } from "../Components/Timeline/Timeline";

export const dummy1 = {
  tracks: [
    {
      id: 0,
      name: "T1",
      blocks: [
        {
          id: 't1-one',
          name: "One",
          start: 0,
          duration: 1
        },
        {
          id: 't1-two',
          name: "Two",
          start: 2,
          duration: 2
        }
      ]
    },
    {
      id: 1,
      name: "T2",
      blocks: [
        {
          id: 't2-one',
          name: "Three",
          start: 0.5,
          duration: 3
        },
        {
          id: 't2-two',
          name: "Four",
          start: 3.5,
          duration: 5
        }
      ]
    }    
  ]
} as ITimeline;