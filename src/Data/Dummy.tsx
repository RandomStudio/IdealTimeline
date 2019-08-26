import { ITimeline } from "../Components/Timeline/Timeline";

export const dummy1 = {
  tracks: [
    {
      id: 0,
      name: "T1",
      blocks: [
        {
          id: 0,
          name: "One",
          start: 0,
          duration: 1
        },
        {
          id: 1,
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
          id: 0,
          name: "Three",
          start: 0.5,
          duration: 3
        },
        {
          id: 1,
          name: "Four",
          start: 3.5,
          duration: 5
        }
      ]
    }    
  ]
} as ITimeline;