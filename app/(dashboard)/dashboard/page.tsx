'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Order = {
  id: string
  customerName: string
  date: string
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
}

type DashboardData = {
  orderCount: number
  orderValue: number
  recentOrders: Order[]
}

// Function to generate example data
const getExampleData = (): DashboardData => {
  return {
    orderCount: 25,
    orderValue: 4500.75,
    recentOrders: [
      { id: '001', customerName: 'John Doe', date: '2023-06-01', total: 150.00, status: 'completed' },
      { id: '002', customerName: 'Jane Smith', date: '2023-06-02', total: 200.50, status: 'processing' },
      { id: '003', customerName: 'Bob Johnson', date: '2023-06-03', total: 75.25, status: 'pending' },
      { id: '004', customerName: 'Alice Brown', date: '2023-06-04', total: 300.00, status: 'completed' },
      { id: '005', customerName: 'Charlie Davis', date: '2023-06-05', total: 125.75, status: 'cancelled' },
      { id: '006', customerName: 'Eva Wilson', date: '2023-06-06', total: 180.50, status: 'completed' },
      { id: '007', customerName: 'Frank Miller', date: '2023-06-07', total: 95.00, status: 'processing' },
      { id: '008', customerName: 'Grace Lee', date: '2023-06-08', total: 250.25, status: 'pending' },
      { id: '009', customerName: 'Henry Taylor', date: '2023-06-09', total: 175.00, status: 'completed' },
      { id: '010', customerName: 'Ivy Clark', date: '2023-06-10', total: 120.75, status: 'processing' },
      { id: '011', customerName: 'Jack Robinson', date: '2023-06-11', total: 220.00, status: 'completed' },
      { id: '012', customerName: 'Karen White', date: '2023-06-12', total: 90.50, status: 'pending' },
      { id: '013', customerName: 'Liam Harris', date: '2023-06-13', total: 310.25, status: 'completed' },
      { id: '014', customerName: 'Mia Turner', date: '2023-06-14', total: 145.00, status: 'processing' },
      { id: '015', customerName: 'Noah Martin', date: '2023-06-15', total: 185.75, status: 'cancelled' }
    ]
  }
}

export default function DashboardPage() {
  const [orderCount, setOrderCount] = useState(0)
  const [orderValue, setOrderValue] = useState(0)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  useEffect(() => {
    // Using the example data function
    const fetchData = () => {
      const data = getExampleData()
      setOrderCount(data.orderCount)
      setOrderValue(data.orderValue)
      setRecentOrders(data.recentOrders)
    }

    fetchData()

    // Commented out actual API call code:
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('/api/dashboard')
    //     const data = await response.json()
    //     setOrderCount(data.orderCount)
    //     setOrderValue(data.orderValue)
    //     setRecentOrders(data.recentOrders)
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error)
    //   }
    // }
    // 
    // fetchData()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orderCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Value This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${orderValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}