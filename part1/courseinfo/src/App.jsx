const Header =({course}) => <h1>{course}</h1>;

const Part =({name, exercises}) => (
  <p>{name}: {exercises}</p>
);

const Content =({parts}) => (
  <div>
    {parts.map((part, index) => (
      <Part key ={index} name={part.name} exercises={part.exercises} />
    ))}
  </div>
)
const Total =({parts}) => {
  const total = parts.reduce((sum, part) => sum+part.exercises, 0)
  return <p>Total: {total} exercises</p>
}
const App =() => {
  const course ='Half Stack application development'
  const parts =[{
    name: 'Fundamentals of React',
    exercises: 10
  },
  {
    name: 'Using props to pass data',
    exercises: 7
  },
  {
    name: 'State of a componentt',
    exercises: 7
  }
  ];
  return (
    <div>
    <Header course ={course}/>
    <Content parts ={parts}/>
    <Total parts ={parts}/>
    </div>
  )

}


export default App
