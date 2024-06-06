'use client'
import dynamic from 'next/dynamic'
import '@/app/globals.css'

const ChartExample = dynamic(
  async () => import('@/app/_components/chart/Chart'),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
)

export default function Home() {
  return (
    <div className="bg-[#2e2e2e] flex flex-col items-center justify-center">
      <h1>Sample Data</h1>
      <ChartExample />
    </div>
  )
}
