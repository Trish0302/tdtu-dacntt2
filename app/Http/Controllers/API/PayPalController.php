<?php

namespace App\Http\Controllers\API;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PayPalController extends Controller
{
    /**
     * create transaction.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\Response
     */
    public function createTransaction()
    {
        return view('pages.paypal.test');
    }

    /**
     * process transaction.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processTransaction(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();

        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => route('successTransaction'),
                "cancel_url" => route('cancelTransaction'),
            ],
            "purchase_units" => [
                0 => [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => "1.00"
                    ]
                ]
            ]
        ]);

        if (isset($response['id']) && $response['id'] != null) {

            // redirect to approve href
            foreach ($response['links'] as $links) {
                if ($links['rel'] == 'approve') {
                    return redirect()->away($links['href']);
                }
            }

            return redirect()
                ->route('createTransaction')
                ->with('error', 'Đã xảy ra lỗi');

        } else {
            return redirect()
                ->route('createTransaction')
                ->with('error', $response['message'] ?? 'Đã xảy ra lỗi');
        }
    }

    /**
     * success transaction.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function successTransaction(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
        $response = $provider->capturePaymentOrder($request['token']);

        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
//            return redirect()
//                ->route('createTransaction')
//                ->with('success', 'Thanh toán bằng Paypal thành công');
//            return redirect()->route('createTransaction',
//                array('success' => 'Thanh toán bằng Paypal thành công',
//                    'status' => '200', "amount"=> "5$",
//                    "orderID" => "123456",
//                    "orderInfo" => "test..."))->with('success', 'Thanh toán bằng Paypal thành công')->withInput();
//            return response()->json([
//                'name' => 'Abigail',
//                'state' => 'CA',

             echo json_encode(['message' => 'Thanh toán bằng Paypal thành công',  'status'=> '200']);
//            ]);
        } else {
            return redirect()
                ->route('createTransaction')
                ->with('error', $response['message'] ?? 'Đã xảy ra lỗi');
        }
    }

    /**
     * cancel transaction.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancelTransaction(Request $request)
    {
        return redirect()
            ->route('createTransaction')
            ->with('error', $response['message'] ?? 'Bạn đã hủy giao dịch');
    }
}
