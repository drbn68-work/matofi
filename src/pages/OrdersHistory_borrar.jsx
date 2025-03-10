// src/pages/OrdersHistory.jsx (ejemplo)
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function OrdersHistory() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const department = sessionStorage.getItem("department")
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (!department) {
      navigate("/")
      return
    }

    console.log("El department es:", department)

    axios.get(`${API_URL}/orders?department=${encodeURIComponent(department)}`)
      .then((response) => {
        setOrders(response.data.orders)
      })
      .catch((error) => {
        console.error("Error al cargar pedidos:", error)
      })
  }, [department, API_URL, navigate])

  if (!orders.length) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Historial de Pedidos</h1>
        <p>No se han realizado pedidos para este Centre de Cost.</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
          onClick={() => navigate("/")}
        >
          Volver a la selección de productos
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Historial de Pedidos</h1>
      {orders.map((order) => (
        <div key={order.id} className="border rounded p-4 mb-4">
          <p><strong>ID:</strong> {order.id}</p>
          <p><strong>Usuario Peticionario:</strong> {order.full_name}</p>
          <p><strong>Centre de Cost:</strong> {order.cost_center}</p>
          <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <h2 className="mt-2 font-semibold">Ítems:</h2>
          {order.items && order.items.length > 0 ? (
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.quantity} x {item.descripcion} (SAP: {item.codsap})
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay ítems para este pedido.</p>
          )}
        </div>
      ))}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => navigate("/")}
      >
        Volver a la selección de productos
      </button>
    </div>
  )
}
