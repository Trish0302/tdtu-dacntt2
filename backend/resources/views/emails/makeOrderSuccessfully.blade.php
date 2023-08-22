<p>Dear {{ $order->name }}, </p>

<p>Delivery address: {{ $order->address }}</p>
<p>Phone number: {{ $order->phone }}</p>
<p>Store name: {{ $order->store->name }}</p>
<p>Customer name: {{ $order->customer->name }}</p>
<p>Order detail:</p>
<table border="1">
    <tr>
        <td>Food name</td>
        <td>Quantity</td>
        <td>Total</td>
    </tr>
    @foreach ($order->detail()->get() as $order_detail)
        <tr>
            <td>{{ $order_detail->food->name }}</td>
            <td>{{ $order_detail->quantity }}</td>
            <td>{{ $order_detail->unit_price * $order_detail->quantity }}</td>
        </tr>
    @endforeach
</table>
<p>Transaction number: {{ $order->transaction_code }}</p>
<p>Total: {{ $order->total }}</p>

<p>Best Regards!</p>
