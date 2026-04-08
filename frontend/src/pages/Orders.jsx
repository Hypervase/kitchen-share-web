import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Orders() {
  const { user } = useAuth();
  const [myOrders, setMyOrders] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('my-orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const myOrdersRes = await api.get('/orders/');
      setMyOrders(myOrdersRes.data.results || myOrdersRes.data || []);

      if (user?.is_cook) {
        const incomingRes = await api.get('/orders/incoming/');
        setIncomingOrders(incomingRes.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/update_status/`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Orders</h1>

        {/* Tabs for cooks */}
        {user?.is_cook && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('my-orders')}
              className={`px-4 py-2 rounded ${
                activeTab === 'my-orders'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab('incoming')}
              className={`px-4 py-2 rounded ${
                activeTab === 'incoming'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Incoming Orders ({incomingOrders.length})
            </button>
          </div>
        )}

        {/* My Orders Tab */}
        {activeTab === 'my-orders' && (
          <div>
            {myOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">You haven't placed any orders yet.</p>
                <Link to="/listings" className="text-orange-500 hover:underline mt-2 inline-block">
                  Browse dishes
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{order.listing_title}</h3>
                        <p className="text-gray-600">Order #{order.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>Quantity: {order.quantity}</p>
                      <p>Total: ${order.total_price}</p>
                      <p>Pickup: {formatDate(order.pickup_time)}</p>
                      <p>Ordered: {formatDate(order.created_at)}</p>
                      {order.notes && <p>Notes: {order.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Incoming Orders Tab (Cook only) */}
        {activeTab === 'incoming' && user?.is_cook && (
          <div>
            {incomingOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">No incoming orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomingOrders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{order.listing_title}</h3>
                        <p className="text-gray-600">Order #{order.id} from {order.buyer_name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm space-y-1 mb-4">
                      <p>Quantity: {order.quantity}</p>
                      <p>Total: ${order.total_price}</p>
                      <p>Pickup: {formatDate(order.pickup_time)}</p>
                      {order.notes && <p>Notes: {order.notes}</p>}
                    </div>

                    {/* Status Update Buttons */}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <div className="flex gap-2 flex-wrap">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(order.id, 'accepted')}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateStatus(order.id, 'cancelled')}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {order.status === 'accepted' && (
                          <button
                            onClick={() => updateStatus(order.id, 'preparing')}
                            className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateStatus(order.id, 'ready')}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateStatus(order.id, 'completed')}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                          >
                            Complete Order
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;