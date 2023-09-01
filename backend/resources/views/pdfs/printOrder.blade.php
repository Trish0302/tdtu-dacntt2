<h1>Order Detail</h1>
<div>
    <p>General information:</p>
    <ul>
        <li>Recipient: {{ $order_detail->name }}</li>
        <li>Address: {{ $order_detail->address }}</li>
        <li>phone: {{ $order_detail->phone }}</li>
        <li>total: {{ $order_detail->total }}</li>
    </ul>
</div>
<p>Customer name: {{ $order_detail->customer->name }}</p>
<p>Store name: {{ $order_detail->store->name }}</p>
<div>
    <p>Voucher information:</p>
    <ul>
        <li>code: {{ $order_detail->voucher->code }}</li>
        <li>discount: {{ $order_detail->voucher->discount }}</li>
    </ul>
</div>
<p>Payment type: {{ $order_detail->payment_type }}</p>
<div>
    <table border="1">
        <tr>
            <td>Ten mon an</td>
            <td>So luong</td>
            <td>Tong tien</td>
        </tr>
        @foreach ($order_detail->detail as $order_detail_items)
            {{-- {{ $order_detail_items->food->name }} --}}
            <tr>
                <td>{{ $order_detail_items->food->name }}</td>
                <td>{{ $order_detail_items->quantity }}</td>
                <td>{{ $order_detail_items->unit_price * $order_detail_items->quantity }}</td>
            </tr>
        @endforeach
    </table>
</div>
<br>
<div>
    <table border="1">
        <tr>
            <td>order_progress</td>
            <td>timestamp</td>
        </tr>
        @foreach ($order_detail->history->progresses as $order_history)
            <tr>
                <td>{{ $order_history->order_progress }}</td>
                <td>{{ $order_history->timestamp }}</td>
            </tr>
        @endforeach
    </table>
</div>
