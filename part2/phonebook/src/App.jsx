


const Course = ({course}) => {
  const totalExercises = course.parts.reduce((sum,part) => sum+part.exercises,0)
  return (
    <>
      <h2>{course.name}</h2>
      {course.parts.map(part =>(
        <p key ={part.id}>{part.name} : {part.exercises}</p>
        
      ))}
      <h3>Total of {totalExercises} exercises</h3>
    </>
  )
}
const App=()=> {
  console.log('app');

  const course =[
    {
    name: 'Half Stack application development',
    id:1,
    parts:[
      {
        name: 'Fundamentals of React',
        exercises:10,
        id:1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id:3
      },
      {
        name: 'State of a component',
        exercises: 14,
        id:3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  },
  {
    name: 'Node.js',
    id:2,
    parts: [
      {
        name: 'Routing',
        exercises: 3,
        id:1
      },
      {
        name: 'Middlewares',
        exercises: 7,
        id: 2
      }
    ]
  }
  ]
  return (
    <div>
      <h1>Web development curriculum</h1>
      {course.map(c =>(
        <Course key ={c.id} course={c} />
      ))}
    </div>
  )
}

export default App
