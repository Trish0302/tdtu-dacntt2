<p>Chào {{ $order->name }},</p>
<p>Chúc mừng bạn đã đặt đơn hàng món ăn thành công tại {{ $order->store->name }}. Chúng tôi xin cảm ơn bạn đã tin tưởng
    và lựa chọn chúng tôi để thỏa mãn nhu cầu ẩm thực của bạn!</p>
<p>Dưới đây là chi tiết đơn hàng của bạn:</p>
<p>Mã đơn hàng: {{ $order->transaction_code }}</p>
<p>Ngày đặt hàng: {{ $order->created_at }}</p>
<p>Sản phẩm đã đặt:</p>
<ol>
    @foreach ($order->detail()->get() as $order_detail)
        <li>{{ $order_detail->food->name }} :
            {{ $order_detail->quantity }} :
            {{ $order_detail->unit_price * $order_detail->quantity }}
        </li>
    @endforeach
</ol>

<p>Tổng cộng: {{ $order->total }}</p>
<p>Đơn hàng của bạn sẽ được xử lý và giao đến địa chỉ bạn đã cung cấp trong thời gian sớm nhất. Quá trình chuẩn bị và
    giao hàng có thể mất một thời gian nhất định. Mong bạn thông cảm và chờ đợi.
</p>
<p>Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu đặc biệt nào liên quan đến đơn hàng của bạn, vui lòng liên hệ với chúng tôi
    qua địa chỉ email {{ $order->store->user->email }} hoặc số điện thoại {{ $order->store->user->phone }} để được hỗ
    trợ.
</p>
<p>Chúc bạn có bữa ăn thú vị và trải nghiệm tuyệt vời cùng chúng tôi!</p>
<p>Trân trọng,</p>
<p>{{ $order->store->name }}</p>
<p>{{ $order->store->address }}</p>
<p>{{ $order->store->user->phone }}</p>
