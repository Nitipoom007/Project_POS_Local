import React, { useState } from "react";
import Swal from "sweetalert2";

function Payment({ total, selected, onBack, onFinish }) {

    const [method, setMethod] = useState(null);
    const [money, setMoney] = useState("");

    const handleCash = () => {
        if (Number(money) < total) {
            Swal.fire({
                title: "จำนวนเงินไม่พอ",
                icon: "error",
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        Swal.fire({
            title: "ชำระเงินเรียบร้อย",
            text: `เงินทอน ${(money - total).toFixed(2)} ฿`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });

        onFinish();
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-xl p-8">

            <h2 className="text-2xl font-bold text-center mb-6">
                ชำระเงิน
            </h2>

            <div className="text-center mb-6">
                <p className="text-gray-500">ยอดที่ต้องชำระ</p>
                <p className="text-3xl font-black text-blue-600">
                    {total.toFixed(2)} ฿
                </p>
            </div>

            {!method && (
                <div className="flex justify-center gap-6">
                    <button
                        className="bg-blue-100 px-6 py-4 rounded-xl"
                        onClick={() => setMethod("cash")}
                    >
                        เงินสด
                    </button>

                    <button
                        className="bg-blue-100 px-6 py-4 rounded-xl"
                        onClick={() => setMethod("promptpay")}
                    >
                        PromptPay
                    </button>
                </div>
            )}

            {method === "cash" && (
                <div className="mt-6 text-center">
                    <input
                        type="number"
                        className="border p-3 rounded w-60 text-center"
                        placeholder="รับมา"
                        value={money}
                        onChange={(e) => setMoney(e.target.value)}
                    />

                    {money && (
                        <p className="mt-3">
                            เงินทอน: {(money - total > 0 ? money - total : 0).toFixed(2)} ฿
                        </p>
                    )}

                    <button
                        className="mt-4 bg-green-500 text-white px-6 py-3 rounded"
                        onClick={handleCash}
                    >
                        ยืนยันการชำระ
                    </button>
                </div>
            )}

            <div className="mt-8 text-center">
                <button
                    className="text-gray-500 underline"
                    onClick={onBack}
                >
                    ← กลับไปตะกร้า
                </button>
            </div>

        </div>
    );
}

export default Payment;