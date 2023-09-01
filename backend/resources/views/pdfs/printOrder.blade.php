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
{{-- {{ $order_detail->detail }} --}}
@foreach ($order_detail->detail() as $order_detail_items)
    <tr>
        {{-- <td>{{ $order_detail_items->food->name }}</td> --}}
        {{-- <td>{{ $order_detail_items->quantity }}</td> --}}
        {{-- <td>{{ $order_detail_items->unit_price * $order_detail_items->quantity }}</td> --}}
    </tr>
@endforeach
