'use client'
import dynamic from 'next/dynamic'
import '@/app/globals.css'

const FinancialChart = dynamic(
  async () => import('@/app/_components/chart/FinancialChart'),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
)

export default function Home() {
  return (
    <div className="bg-[#2e2e2e] flex flex-col items-center justify-center">
      <h1>Sample Data</h1>
      <FinancialChart />
    </div>
  )
}
