import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 300, pv: 4567, amt: 2400 },
  { name: 'Page C', uv: 200, pv: 1398, amt: 2400 },
  { name: 'Page D', uv: 278, pv: 9800, amt: 2400 },
  { name: 'Page E', uv: 189, pv: 3908, amt: 2400 },
  { name: 'Page F', uv: 239, pv: 4800, amt: 2400 },
  { name: 'Page G', uv: 349, pv: 4300, amt: 2400 },
]

const Home = () => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <h1>Recharts with Next.js and TypeScript</h1>
      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  )
}

export default Home
