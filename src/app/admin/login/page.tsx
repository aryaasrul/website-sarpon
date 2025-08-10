'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('isAdmin', 'true')
      router.push('/admin')
    } else {
      alert('Username atau password salah.')
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Login Admin</h1>
      <form onSubmit={handleLogin} className="max-w-sm space-y-4">
        <input className="input" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn w-full" type="submit">Login</button>
      </form>
    </div>
  )
}