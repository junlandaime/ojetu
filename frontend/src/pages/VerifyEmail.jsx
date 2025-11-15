import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ state: "loading" });

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        if (response.data?.success) {
          setStatus({ state: "success", message: response.data.message });
          return;
        }

        const message =
          response.data?.message ||
          "Token verifikasi tidak valid. Silakan minta tautan baru.";
        setStatus({ state: "error", message });
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Gagal memverifikasi email. Silakan coba lagi nanti.";
        setStatus({ state: "error", message });
      }
    };

    if (token) {
      verify();
    } else {
      setStatus({
        state: "error",
        message: "Token verifikasi tidak ditemukan dalam tautan.",
      });
    }
  }, [token]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body text-center p-4">
              {status.state === "loading" && (
                <>
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h5 className="card-title">Memverifikasi email Anda...</h5>
                  <p className="card-text text-muted">
                    Mohon tunggu sebentar, kami sedang memvalidasi tautan verifikasi
                    Anda.
                  </p>
                </>
              )}

              {status.state === "success" && (
                <>
                  <div className="text-success display-6 mb-3">✓</div>
                  <h5 className="card-title">Email Berhasil Diverifikasi</h5>
                  <p className="card-text">{status.message}</p>
                  <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={handleGoToLogin}
                  >
                    Masuk ke Akun
                  </button>
                </>
              )}

              {status.state === "error" && (
                <>
                  <div className="text-danger display-6 mb-3">!</div>
                  <h5 className="card-title">Verifikasi Gagal</h5>
                  <p className="card-text">{status.message}</p>
                  <button
                    type="button"
                    className="btn btn-outline-primary mt-3"
                    onClick={handleGoToLogin}
                  >
                    Kembali ke Halaman Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;