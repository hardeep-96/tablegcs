import namor from 'namor'

export type Person = {
  id: number
  name: string
  status: string
  description: string
  delta: number
  createdOn: Date
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  const statusChance = Math.random()
  return {
    id: +(Math.random()*1000).toFixed(0),
    name: namor.generate({ words: 1, saltLength: 0, subset: 'manly' }),
    status: statusChance > 0.66 ? 'Excellent' : statusChance > 0.33 ? 'Good' : 'Bad',
    description: namor.generate({ words: 4, saltLength: 8 }),
    delta: Math.floor(Math.random() * 100),
    createdOn: new Date(Math.random() * +new Date()),
  }
}

export interface PersonData extends Person {
  subRows?: PersonData[]
}

export function makeData(...lens: number[]): PersonData[] {
  const makeDataLevel = (depth = 0): PersonData[] => {
    const len = lens[depth]
    return range(len).map((_) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
