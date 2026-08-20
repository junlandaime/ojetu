<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useEffect, useMemo, useState } from "react";
>>>>>>> perbaikan-website-fitalenta
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import helpers from "../utils/helpers";

<<<<<<< HEAD
const ProgramRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [programs, setPrograms] = useState([]);
  
  // --- STATE BARU UNTUK KATEGORI & AGREEMENT ---
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [paymentAgreement, setPaymentAgreement] = useState(false);
  // ---------------------------------------------

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);
  const [agreement, setAgreement] = useState(false);
  const [isSameAsKTP, setIsSameAsKTP] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const mapValueToLabel = {
    current_activity: {
      pelajar: "Pelajar",
      mahasiswa: "Mahasiswa",
      bekerja: "Bekerja",
      tidak_bekerja: "Tidak Bekerja",
      pencari_kerja: "Pencari Kerja",
    },
    marital_status: {
      belum_menikah: "Belum Menikah",
      sudah_menikah: "Sudah Menikah",
      sudah_menikah_dan_memiliki_anak: "Sudah Menikah dan Memiliki Anak",
    },
    parent_relationship: {
      ayah: "Ayah",
      ibu: "Ibu",
      kakak: "Kakak",
      kerabat: "Kerabat",
    },
    last_education: {
      SMA: "SMA/Sederajat",
      D1: "D1",
      D2: "D2",
      D3: "D3",
      D4: "D4",
      S1: "S1",
      S2: "S2",
      S3: "S3",
    },
  };

  const getDisplayLabel = (fieldName, value) => {
    if (!value) return "-";
    return mapValueToLabel[fieldName]?.[value] || value;
  };

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    nik: "",
    gender: "",
    birth_place: "",
    birth_date: "",
    email: user?.email || "",
    phone: user?.phone || "",
    last_education: "",
    parent_phone: "",
    parent_relationship: "",
    major: "",
    education_institution: "",
    current_activity: "",
    marital_status: "",
    ktp_province: "",
    ktp_province_name: "",
    ktp_city: "",
    ktp_city_name: "",
    ktp_address: "",
    domicile_province: "",
    domicile_province_name: "",
    domicile_city: "",
    domicile_city_name: "",
    domicile_address: "",
    photo_file: null,
    photo_preview: null,
    program_id: "",
    n4_file: null,
    n4_preview: null,
    ssw_file: null,
    ssw_preview: null,
  });

  useEffect(() => {
    fetchPrograms();
    fetchCategories(); // Ambil data kategori saat mount
    fetchProvinces();
  }, []);

  useEffect(() => {
    return () => {
      const previewFields = ["photo", "n4", "ssw"];
      previewFields.forEach((field) => {
        const preview = formData[`${field}_preview`];
        if (preview && typeof preview === "string") {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (isSameAsKTP) {
      setFormData((prev) => ({
        ...prev,
        domicile_province: prev.ktp_province,
        domicile_province_name: prev.ktp_province_name,
        domicile_city: prev.ktp_city,
        domicile_city_name: prev.ktp_city_name,
        domicile_address: prev.ktp_address,
      }));
    }
  }, [
    isSameAsKTP,
    formData.ktp_province,
    formData.ktp_province_name,
    formData.ktp_city,
    formData.ktp_city_name,
    formData.ktp_address,
  ]);

  useEffect(() => {
    const isSame =
      formData.domicile_province === formData.ktp_province &&
      formData.domicile_city === formData.ktp_city &&
      formData.domicile_address === formData.ktp_address;

    setIsSameAsKTP(isSame);
  }, [
    formData.domicile_province,
    formData.domicile_city,
    formData.domicile_address,
    formData.ktp_province,
    formData.ktp_city,
    formData.ktp_address,
  ]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/programs");
      if (response.data.success) {
        setPrograms(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      setError("Gagal memuat data program");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI FETCH KATEGORI ---
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/program-categories");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Tidak set error global agar tidak memblokir flow jika kategori gagal load
    }
  };

  const fetchProvinces = async () => {
    try {
      setLoadingProvinces(true);
      const response = await axios.get("/api/wilayah/provinces");

      if (response.data.success) {
        setProvinces(response.data.data);
      } else {
        setError("Gagal memuat data provinsi");
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      setError("Gagal memuat data provinsi");
    } finally {
      setLoadingProvinces(false);
    }
  };

  const fetchCities = async (provinceCode, type) => {
    try {
      setLoadingCities((prev) => ({ ...prev, [provinceCode]: true }));

      const response = await axios.get(
        `/api/wilayah/regencies/${provinceCode}`
      );

      if (response.data.success) {
        setCities((prev) => ({
          ...prev,
          [provinceCode]: response.data.data,
        }));
      }
    } catch (error) {
      console.error(
        `Error fetching cities for province ${provinceCode}:`,
        error
      );
      setError(
        `Gagal memuat data kabupaten/kota untuk provinsi ${provinceCode}`
      );
    } finally {
      setLoadingCities((prev) => ({ ...prev, [provinceCode]: false }));
    }
  };

  const handleFileChange = async (fieldName, file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (fieldName === "photo") {
      if (!file.type.startsWith("image/")) {
        setError("File foto harus berupa gambar (JPG, PNG)");
        return;
      }
    } else {
      if (!allowedTypes.includes(file.type)) {
        setError(`File ${fieldName} harus berupa JPG, PNG, atau PDF`);
        return;
      }
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(`Ukuran file ${fieldName} maksimal 10MB`);
      return;
    }

    try {
      setError("");

      let previewUrl = null;
      if (file.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(file);
      }

      setFormData((prev) => ({
        ...prev,
        [`${fieldName}_file`]: file,
        [`${fieldName}_preview`]: previewUrl,
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "ktp_province") {
      const selectedProvince = provinces.find((p) => p.code === value);
      setFormData((prev) => ({
        ...prev,
        ktp_province: value,
        ktp_province_name: selectedProvince ? selectedProvince.name : "",
        ktp_city: "",
        ktp_city_name: "",
      }));

      if (value && !cities[value]) {
        fetchCities(value, "ktp");
      }

      if (isSameAsKTP) {
        setFormData((prev) => ({
          ...prev,
          domicile_province: value,
          domicile_province_name: selectedProvince ? selectedProvince.name : "",
          domicile_city: "",
          domicile_city_name: "",
        }));
      }
    } else if (name === "ktp_city") {
      const selectedCity = cities[formData.ktp_province]?.find(
        (c) => c.code === value
      );
      setFormData((prev) => ({
        ...prev,
        ktp_city: value,
        ktp_city_name: selectedCity ? selectedCity.name : "",
      }));

      if (isSameAsKTP) {
        setFormData((prev) => ({
          ...prev,
          domicile_city: value,
          domicile_city_name: selectedCity ? selectedCity.name : "",
        }));
      }
    } else if (name === "ktp_address") {
      setFormData((prev) => ({
        ...prev,
        ktp_address: value,
      }));

      if (isSameAsKTP) {
        setFormData((prev) => ({
          ...prev,
          domicile_address: value,
        }));
      }
    } else if (name === "domicile_province") {
      const selectedProvince = provinces.find((p) => p.code === value);
      setFormData((prev) => ({
        ...prev,
        domicile_province: value,
        domicile_province_name: selectedProvince ? selectedProvince.name : "",
        domicile_city: "",
        domicile_city_name: "",
      }));

      if (value && !cities[value]) {
        fetchCities(value, "domicile");
      }
    } else if (name === "domicile_city") {
      const selectedCity = cities[formData.domicile_province]?.find(
        (c) => c.code === value
      );
      setFormData((prev) => ({
        ...prev,
        domicile_city: value,
        domicile_city_name: selectedCity ? selectedCity.name : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsSameAsKTP(checked);

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        domicile_province: prev.ktp_province,
        domicile_province_name: prev.ktp_province_name,
        domicile_city: prev.ktp_city,
        domicile_city_name: prev.ktp_city_name,
        domicile_address: prev.ktp_address,
      }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      setError("");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setError("");
  };

  const validateStep = (step) => {
    const errors = [];

    if (step === 1) {
      if (!formData.full_name) errors.push("Nama lengkap harus diisi");
      if (!formData.nik) errors.push("NIK harus diisi");
      if (!formData.gender) errors.push("Jenis kelamin harus dipilih");
      if (!formData.birth_place) errors.push("Tempat lahir harus diisi");
      if (!formData.birth_date) errors.push("Tanggal lahir harus diisi");
      if (!formData.phone) errors.push("Nomor handphone harus diisi");
      if (!formData.last_education)
        errors.push("Pendidikan terakhir harus diisi");
      if (!formData.parent_phone)
        errors.push("Nomor handphone orang tua harus diisi");

      if (!formData.parent_relationship)
        errors.push("Hubungan dengan orang tua/wali harus dipilih");
      if (!formData.major) errors.push("Jurusan harus diisi");
      if (!formData.education_institution)
        errors.push("Asal institusi pendidikan terakhir harus diisi");
      if (!formData.current_activity)
        errors.push("Pekerjaan/aktivitas saat ini harus dipilih");
      if (!formData.marital_status)
        errors.push("Status pernikahan harus dipilih");

      if (!formData.ktp_province) errors.push("Provinsi KTP harus dipilih");
      if (!formData.ktp_city) errors.push("Kota/Kabupaten KTP harus dipilih");
      if (!formData.ktp_address) errors.push("Alamat KTP harus diisi");
      if (!formData.domicile_province)
        errors.push("Provinsi domisili harus dipilih");
      if (!formData.domicile_city)
        errors.push("Kota/Kabupaten domisili harus dipilih");
      if (!formData.domicile_address)
        errors.push("Alamat domisili harus diisi");

      if (!formData.photo_file) errors.push("Foto harus diupload");
    }

    if (step === 2) {
      if (!selectedCategory) errors.push("Kategori program harus dipilih");
      if (!formData.program_id) errors.push("Program harus dipilih");

      const selectedProgram = programs.find((p) => p.id == formData.program_id);
      if (selectedProgram?.name?.toLowerCase().includes("fast track")) {
        if (!formData.n4_file)
          errors.push("Sertifikat N4 harus diupload untuk program Fast Track");
        if (!formData.ssw_file)
          errors.push("Sertifikat SSW harus diupload untuk program Fast Track");
      }
    }

    // --- UPDATE VALIDASI STEP 3 ---
    if (step === 3) {
      if (!agreement) errors.push("Anda harus menyetujui syarat dan ketentuan data");
      if (!paymentAgreement) errors.push("Anda harus menyetujui komitmen pembayaran");
    }

    if (errors.length > 0) {
      setError(errors.join(", "));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    try {
      setSubmitLoading(true);
      setError("");

      let photoPath = null;
      if (formData.photo_file) {
        const photoFormData = new FormData();
        photoFormData.append("file", formData.photo_file);

        // console.log("Uploading photo...");
        const uploadResponse = await axios.post(
          "/api/uploads/photo",
          photoFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadResponse.data.success) {
          photoPath = uploadResponse.data.data.file_path;
          // console.log("Photo uploaded:", photoPath);
        } else {
          throw new Error("Gagal mengupload foto");
        }
      }

      let n4Path = null;
      let sswPath = null;
      
      const selectedProgram = programs.find((p) => p.id == formData.program_id);
      const isFastTrack = selectedProgram?.name?.toLowerCase().includes("fast track");

      if (isFastTrack) {
        if (formData.n4_file) {
          const n4FormData = new FormData();
          n4FormData.append("file", formData.n4_file);
          n4FormData.append("type", "n4_certificate");

          // console.log("Uploading N4 certificate...");
          const n4Response = await axios.post(
            "/api/uploads/document",
            n4FormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (n4Response.data.success) {
            n4Path = n4Response.data.data.file_path;
            // console.log("N4 certificate uploaded:", n4Path);
          } else {
            throw new Error("Gagal mengupload sertifikat N4");
          }
        }

        if (formData.ssw_file) {
          const sswFormData = new FormData();
          sswFormData.append("file", formData.ssw_file);
          sswFormData.append("type", "ssw_certificate");

          // console.log("Uploading SSW certificate...");
          const sswResponse = await axios.post(
            "/api/uploads/document",
            sswFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (sswResponse.data.success) {
            sswPath = sswResponse.data.data.file_path;
            // console.log("SSW certificate uploaded:", sswPath);
          } else {
            throw new Error("Gagal mengupload sertifikat SSW");
          }
        }
      }

      const registrationData = {
        user_id: user.id,
        program_id: formData.program_id,
        nik: formData.nik,
        gender: formData.gender,
        birth_place: formData.birth_place,
        birth_date: formData.birth_date,
        last_education: formData.last_education,
        parent_phone: formData.parent_phone,

        parent_relationship: formData.parent_relationship,
        major: formData.major,
        education_institution: formData.education_institution,
        current_activity: formData.current_activity,
        marital_status: formData.marital_status,

        ktp_province_code: formData.ktp_province,
        ktp_province_name: formData.ktp_province_name,
        ktp_city_code: formData.ktp_city,
        ktp_city_name: formData.ktp_city_name,
        ktp_address: formData.ktp_address,
        domicile_province_code: formData.domicile_province,
        domicile_province_name: formData.domicile_province_name,
        domicile_city_code: formData.domicile_city,
        domicile_city_name: formData.domicile_city_name,
        domicile_address: formData.domicile_address,

        photo_path: photoPath,

        n4_certificate_path: n4Path,
        ssw_certificate_path: sswPath,

        user_data: {
          full_name: formData.full_name,
          phone: formData.phone,
        },
      };

      const response = await axios.post("/api/registrations", registrationData);

      if (response.data.success) {
        setRegistrationResult(response.data.data);
        setShowSuccessModal(true);
      } else {
        setError(response.data.message || "Gagal melakukan pendaftaran");
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error details:", error.response?.data);
      setError(
        error.response?.data?.message ||
        "Terjadi kesalahan saat mendaftar. Silakan coba lagi."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const getCurrentCities = (provinceCode) => {
    return cities[provinceCode] || [];
  };

  const isCitiesLoading = (provinceCode) => {
    return loadingCities[provinceCode] || false;
  };

  const isUploading = (fieldName) => {
    return uploadingFiles[fieldName] || false;
  };

  const renderStep1 = () => (
    <div className="row">
      <div className="col-12">
        <h4 className="mb-4">Data Diri</h4>
      </div>

      <div className="col-12 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Upload Foto</h5>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="photo" className="form-label">
                  Foto <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="photo"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange("photo", e.target.files[0])}
                  disabled={isUploading("photo")}
                  required
                />
                <div className="form-text">
                  Format: JPG, PNG (Maksimal 10MB)
                </div>
                {isUploading("photo") && (
                  <div className="mt-2">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Mengupload...</span>
                    </div>
                    <small className="text-muted ms-2">
                      Mengupload foto...
                    </small>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                {formData.photo_preview && (
                  <div className="text-center">
                    <p className="mb-2">
                      <strong>Preview Foto:</strong>
                    </p>
                    <img
                      src={formData.photo_preview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <h5 className="mb-3">Data Pribadi</h5>
      </div>

      {/* Baris 1 */}
      <div className="col-md-6 mb-3">
        <label htmlFor="full_name" className="form-label">
          Nama Lengkap <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="nik" className="form-label">
          NIK <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="nik"
          name="nik"
          value={formData.nik}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Baris 2 */}
      <div className="col-md-6 mb-3">
        <label htmlFor="gender" className="form-label">
          Jenis Kelamin <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
        >
          <option value="">Pilih Jenis Kelamin</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="birth_place" className="form-label">
          Tempat Lahir <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="birth_place"
          name="birth_place"
          value={formData.birth_place}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Baris 3 */}
      <div className="col-md-6 mb-3">
        <label htmlFor="birth_date" className="form-label">
          Tanggal Lahir <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className="form-control"
          id="birth_date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="email" className="form-label">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          readOnly
          disabled
        />
        <small className="text-muted">
          Email sesuai dengan akun registrasi
        </small>
      </div>

      {/* Baris 4 */}
      <div className="col-md-6 mb-3">
        <label htmlFor="phone" className="form-label">
          Nomor Handphone <span className="text-danger">*</span>
        </label>
        <input
          type="tel"
          className="form-control"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="last_education" className="form-label">
          Pendidikan Terakhir <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="last_education"
          name="last_education"
          value={formData.last_education}
          onChange={handleInputChange}
          required
        >
          <option value="">Pilih Pendidikan</option>
          <option value="SMA">SMA/Sederajat</option>
          <option value="D1">D1</option>
          <option value="D2">D2</option>
          <option value="D3">D3</option>
          <option value="D4">D4</option>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
          <option value="S3">S3</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="major" className="form-label">
          Jurusan <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="major"
          name="major"
          value={formData.major}
          onChange={handleInputChange}
          placeholder="Contoh: Teknik Informatika, Akuntansi, dll."
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="education_institution" className="form-label">
          Asal Institusi Pendidikan Terakhir{" "}
          <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="education_institution"
          name="education_institution"
          value={formData.education_institution}
          onChange={handleInputChange}
          placeholder="Contoh: Universitas Indonesia, SMAN 1 Bandung, dll."
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="current_activity" className="form-label">
          Pekerjaan/Aktivitas Saat Ini <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="current_activity"
          name="current_activity"
          value={formData.current_activity}
          onChange={handleInputChange}
          required
        >
          <option value="">Pilih Aktivitas</option>
          <option value="pelajar">Pelajar</option>
          <option value="mahasiswa">Mahasiswa</option>
          <option value="bekerja">Bekerja</option>
          <option value="tidak_bekerja">Tidak Bekerja</option>
          <option value="pencari_kerja">Pencari Kerja</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="marital_status" className="form-label">
          Status Pernikahan <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="marital_status"
          name="marital_status"
          value={formData.marital_status}
          onChange={handleInputChange}
          required
        >
          <option value="">Pilih Status</option>
          <option value="belum_menikah">Belum Menikah</option>
          <option value="sudah_menikah">Sudah Menikah</option>
          <option value="sudah_menikah_dan_memiliki_anak">
            Sudah Menikah dan Memiliki Anak
          </option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="parent_relationship" className="form-label">
          Hubungan dengan Orang Tua/Wali <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="parent_relationship"
          name="parent_relationship"
          value={formData.parent_relationship}
          onChange={handleInputChange}
          required
        >
          <option value="">Pilih Hubungan</option>
          <option value="ayah">Ayah</option>
          <option value="ibu">Ibu</option>
          <option value="kakak">Kakak</option>
          <option value="kerabat">Kerabat</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="parent_phone" className="form-label">
          Nomor Handphone Orang Tua/Wali <span className="text-danger">*</span>
        </label>
        <input
          type="tel"
          className="form-control"
          id="parent_phone"
          name="parent_phone"
          value={formData.parent_phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="col-12 mt-4">
        <h5>Alamat Sesuai KTP</h5>
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="ktp_province" className="form-label">
          Provinsi <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="ktp_province"
          name="ktp_province"
          value={formData.ktp_province}
          onChange={handleInputChange}
          required
        >
          <option value="">Pilih Provinsi</option>
          {loadingProvinces ? (
            <option value="" disabled>
              Memuat data provinsi...
            </option>
          ) : (
            provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))
          )}
        </select>
        {loadingProvinces && (
          <small className="text-muted">Memuat data provinsi...</small>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="ktp_city" className="form-label">
          Kabupaten/Kota <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="ktp_city"
          name="ktp_city"
          value={formData.ktp_city}
          onChange={handleInputChange}
          disabled={
            !formData.ktp_province || isCitiesLoading(formData.ktp_province)
          }
          required
        >
          <option value="">Pilih Kabupaten/Kota</option>
          {formData.ktp_province && isCitiesLoading(formData.ktp_province) ? (
            <option value="" disabled>
              Memuat data kabupaten/kota...
            </option>
          ) : (
            formData.ktp_province &&
            getCurrentCities(formData.ktp_province).map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))
          )}
        </select>
        {formData.ktp_province && isCitiesLoading(formData.ktp_province) && (
          <small className="text-muted">Memuat data kabupaten/kota...</small>
        )}
      </div>

      <div className="col-12 mb-3">
        <label htmlFor="ktp_address" className="form-label">
          Detail Alamat <span className="text-danger">*</span>
        </label>
        <textarea
          className="form-control"
          id="ktp_address"
          name="ktp_address"
          rows="3"
          value={formData.ktp_address}
          onChange={handleInputChange}
          placeholder="Masukkan alamat lengkap sesuai KTP"
          required
        ></textarea>
      </div>

      <div className="col-12 mt-4">
        <h5>Alamat Domisili</h5>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="same_as_ktp"
            checked={isSameAsKTP}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="same_as_ktp">
            Sama dengan alamat KTP
          </label>
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="domicile_province" className="form-label">
          Provinsi <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="domicile_province"
          name="domicile_province"
          value={formData.domicile_province}
          onChange={handleInputChange}
          disabled={isSameAsKTP}
          required
        >
          <option value="">Pilih Provinsi</option>
          {loadingProvinces ? (
            <option value="" disabled>
              Memuat data provinsi...
            </option>
          ) : (
            provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="domicile_city" className="form-label">
          Kabupaten/Kota <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="domicile_city"
          name="domicile_city"
          value={formData.domicile_city}
          onChange={handleInputChange}
          disabled={
            isSameAsKTP ||
            !formData.domicile_province ||
            isCitiesLoading(formData.domicile_province)
          }
          required
        >
          <option value="">Pilih Kabupaten/Kota</option>
          {formData.domicile_province &&
            isCitiesLoading(formData.domicile_province) ? (
            <option value="" disabled>
              Memuat data kabupaten/kota...
            </option>
          ) : (
            formData.domicile_province &&
            getCurrentCities(formData.domicile_province).map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))
          )}
        </select>
        {formData.domicile_province &&
          isCitiesLoading(formData.domicile_province) && (
            <small className="text-muted">Memuat data kabupaten/kota...</small>
          )}
      </div>

      <div className="col-12 mb-3">
        <label htmlFor="domicile_address" className="form-label">
          Detail Alamat <span className="text-danger">*</span>
        </label>
        <textarea
          className="form-control"
          id="domicile_address"
          name="domicile_address"
          rows="3"
          value={formData.domicile_address}
          onChange={handleInputChange}
          placeholder="Masukkan alamat lengkap domisili saat ini"
          disabled={isSameAsKTP}
          required
        ></textarea>
      </div>
    </div>
  );

  const renderStep2 = () => {
    // Filter program berdasarkan kategori yang dipilih
    // Asumsi: field kategori di database program adalah `program_category_id`
    const filteredPrograms = selectedCategory
      ? programs.filter((p) => p.category_id === parseInt(selectedCategory)) // Sesuaikan dengan nama kolom database
      : [];

    const selectedProgram = programs.find((p) => p.id == formData.program_id);
    const isFastTrack = selectedProgram?.name?.toLowerCase().includes("fast track");

    return (
      <div className="row">
        <div className="col-12">
          <h4 className="mb-4">Pemilihan Program dan Dokumen</h4>

          {/* 1. PILIH KATEGORI TERLEBIH DAHULU */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                1. Pilih Kategori Program <span className="text-danger">*</span>
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">
                  Silakan pilih kategori program yang diminati:
                </label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setFormData((prev) => ({ ...prev, program_id: "" })); // Reset program
                  }}
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. PILIH PROGRAM (Hanya muncul jika kategori sudah dipilih) */}
          {selectedCategory && (
            <div className="card mb-4 animate__animated animate__fadeIn">
              <div className="card-header">
                <h5>
                  2. Pilih Program Tersedia <span className="text-danger">*</span>
                </h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Memuat data program...</p>
                  </div>
                ) : filteredPrograms.length === 0 ? (
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    Tidak ada program yang tersedia untuk kategori ini saat ini.
                  </div>
                ) : (
                  <div className="row">
                    {filteredPrograms.map((program) => (
                      <div key={program.id} className="col-md-6 mb-3">
                        <div
                          className={`card h-100 ${
                            formData.program_id == program.id
                              ? "border-primary shadow-sm"
                              : ""
                          }`}
                        >
                          <div className="card-body">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="program_selection"
                                id={`program-${program.id}`}
                                value={program.id}
                                checked={formData.program_id == program.id}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    program_id: e.target.value,
                                  }))
                                }
                              />
                              <label
                                className="form-check-label w-100 cursor-pointer"
                                htmlFor={`program-${program.id}`}
                                style={{ cursor: "pointer" }}
                              >
                                <h5 className="card-title text-primary">
                                  {program.name}
                                </h5>
                                <p className="card-text text-muted small">
                                  {program.description?.substring(0, 150)}...
                                </p>
                                <div className="d-flex flex-column gap-1 mt-2 text-sm">
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-clock me-2 text-muted"></i>
                                    <span>{program.duration}</span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-cash-stack me-2 text-muted"></i>
                                    <span className="fw-bold text-success">
                                      {helpers.formatCurrency(
                                        program.training_cost
                                      )}
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-calendar-event me-2 text-muted"></i>
                                    <span>{program.schedule}</span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. DOKUMEN TAMBAHAN (Fast Track) */}
          {isFastTrack && (
            <div className="card">
              <div className="card-header">
                <h5>
                  3. Dokumen Tambahan (Fast Track){" "}
                  <span className="text-danger">*</span>
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="n4" className="form-label">
                      Sertifikat N4 <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="n4"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) =>
                        handleFileChange("n4", e.target.files[0])
                      }
                      disabled={isUploading("n4")}
                      required={isFastTrack}
                    />
                    <div className="form-text">
                      Format: JPG, PNG, PDF (Maksimal 10MB)
                    </div>
                    {formData.n4_preview && (
                      <div className="mt-2">
                        {formData.n4_file.type.startsWith("image/") ? (
                          <img
                            src={formData.n4_preview}
                            alt="Preview N4"
                            className="img-thumbnail"
                            style={{ maxWidth: "200px" }}
                          />
                        ) : (
                          <div className="text-center">
                            <i className="bi bi-file-pdf fs-1 text-danger"></i>
                            <p className="small">{formData.n4_file.name}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="ssw" className="form-label">
                      Sertifikat SSW <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="ssw"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) =>
                        handleFileChange("ssw", e.target.files[0])
                      }
                      disabled={isUploading("ssw")}
                      required={isFastTrack}
                    />
                    <div className="form-text">
                      Format: JPG, PNG, PDF (Maksimal 10MB)
                    </div>
                    {formData.ssw_preview && (
                      <div className="mt-2">
                        {formData.ssw_file.type.startsWith("image/") ? (
                          <img
                            src={formData.ssw_preview}
                            alt="Preview SSW"
                            className="img-thumbnail"
                            style={{ maxWidth: "200px" }}
                          />
                        ) : (
                          <div className="text-center">
                            <i className="bi bi-file-pdf fs-1 text-danger"></i>
                            <p className="small">{formData.ssw_file.name}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const selectedProgram = programs.find((p) => p.id == formData.program_id);
    const programCost = selectedProgram ? selectedProgram.training_cost : 0;
    
    // Logic untuk dokumen fast track di summary
    const isFastTrack = selectedProgram?.name?.toLowerCase().includes("fast track");

    return (
      <div className="row">
        <div className="col-12">
          <h4 className="mb-4">Konfirmasi Pendaftaran</h4>

          {/* Foto */}
          <div className="card mb-3">
            <div className="card-header">
              <h5>Foto</h5>
            </div>
            <div className="card-body">
              {formData.photo_preview ? (
                <div className="text-center">
                  <img
                    src={formData.photo_preview}
                    alt="Foto Peserta"
                    className="img-thumbnail"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <p className="text-muted">Foto belum diupload</p>
              )}
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header">
              <h5>Data Diri</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Nama Lengkap:</strong> {formData.full_name}
                  </p>
                  <p>
                    <strong>NIK:</strong> {formData.nik}
                  </p>
                  <p>
                    <strong>Jenis Kelamin:</strong>{" "}
                    {formData.gender === "L" ? "Laki-laki" : "Perempuan"}
                  </p>
                  <p>
                    <strong>Tempat, Tanggal Lahir:</strong>{" "}
                    {formData.birth_place}, {formData.birth_date}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>No. Handphone:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong>Pendidikan Terakhir:</strong>{" "}
                    {getDisplayLabel("last_education", formData.last_education)}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Jurusan:</strong> {formData.major}
                  </p>
                  <p>
                    <strong>Asal Institusi Pendidikan:</strong>{" "}
                    {formData.education_institution}
                  </p>
                  <p>
                    <strong>Pekerjaan/Aktivitas Saat Ini:</strong>{" "}
                    {getDisplayLabel(
                      "current_activity",
                      formData.current_activity
                    )}
                  </p>
                  <p>
                    <strong>Status Pernikahan:</strong>{" "}
                    {getDisplayLabel("marital_status", formData.marital_status)}
                  </p>
                  <p>
                    <strong>Hubungan dengan Orang Tua/Wali:</strong>{" "}
                    {getDisplayLabel(
                      "parent_relationship",
                      formData.parent_relationship
                    )}
                  </p>
                  <p>
                    <strong>No. HP Orang Tua/Wali:</strong>{" "}
                    {formData.parent_phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div className="card mb-3">
            <div className="card-header">
              <h5>Alamat</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Alamat KTP</h6>
                  <p>
                    <strong>Provinsi:</strong> {formData.ktp_province_name}
                  </p>
                  <p>
                    <strong>Kota/Kabupaten:</strong> {formData.ktp_city_name}
                  </p>
                  <p>
                    <strong>Alamat:</strong> {formData.ktp_address}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>Alamat Domisili</h6>
                  <p>
                    <strong>Provinsi:</strong> {formData.domicile_province_name}
                  </p>
                  <p>
                    <strong>Kota/Kabupaten:</strong>{" "}
                    {formData.domicile_city_name}
                  </p>
                  <p>
                    <strong>Alamat:</strong> {formData.domicile_address}
                  </p>
                  {isSameAsKTP && (
                    <div className="alert alert-info mt-2 p-2">
                      <small>
                        <i className="bi bi-info-circle"></i> Alamat domisili
                        sama dengan alamat KTP
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Program */}
          <div className="card mb-3">
            <div className="card-header">
              <h5>Program yang Dipilih</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Program:</strong> {selectedProgram?.name}
              </p>
              <p>
                <strong>Durasi:</strong> {selectedProgram?.duration}
              </p>
              <p>
                <strong>Biaya:</strong>{" "}
                {helpers.formatCurrency(selectedProgram?.training_cost)}
              </p>
            </div>
          </div>

          {/* Dokumen - HANYA untuk Fast Track */}
          {isFastTrack && (
            <div className="card mb-3">
              <div className="card-header">
                <h5>Dokumen Tambahan (Fast Track)</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Sertifikat N4:</strong>{" "}
                      {formData.n4_file
                        ? formData.n4_file.name
                        : "Belum diupload"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Sertifikat SSW:</strong>{" "}
                      {formData.ssw_file
                        ? formData.ssw_file.name
                        : "Belum diupload"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PERNYATAAN PERSETUJUAN (UPDATE BARU) */}
          <div className="card border-primary mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Pernyataan Persetujuan</h5>
            </div>
            <div className="card-body">
              {/* Checkbox 1: Validitas Data & Syarat Umum */}
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="agreement"
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                  required
                  style={{ transform: "scale(1.2)", marginTop: "0.2rem" }}
                />
                <label className="form-check-label ms-2" htmlFor="agreement">
                  Saya menyatakan bahwa semua data yang tertera di atas adalah
                  benar dan valid. Saya juga telah membaca, memahami, dan
                  menyetujui semua Syarat dan Ketentuan Program yang berlaku di
                  FITALENTA. <span className="text-danger">*</span>
                </label>
              </div>

              <hr />

              {/* Checkbox 2: Komitmen Pembayaran (BARU) */}
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="paymentAgreement"
                  checked={paymentAgreement}
                  onChange={(e) => setPaymentAgreement(e.target.checked)}
                  required
                  style={{ transform: "scale(1.2)", marginTop: "0.2rem" }}
                />
                <label
                  className="form-check-label ms-2 fw-bold text-dark"
                  htmlFor="paymentAgreement"
                >
                  Saya menyatakan KOMITMEN dan KESANGGUPAN untuk melunasi
                  seluruh biaya program sebesar{" "}
                  <span className="text-primary">
                    {helpers.formatCurrency(programCost)}
                  </span>{" "}
                  sesuai dengan skema pembayaran yang telah ditentukan oleh
                  FITALENTA. Saya mengerti bahwa pendaftaran ini adalah bukti
                  keseriusan saya untuk mengikuti program hingga selesai.{" "}
                  <span className="text-danger">*</span>
                </label>
              </div>
            </div>
          </div>

          <div className="alert alert-warning mt-4 d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill fs-3 me-3"></i>
            <div>
              <strong>Perhatian!</strong>
              <p className="mb-0">
                Pastikan semua data yang Anda isi sudah benar. Data yang sudah
                dikirim tidak dapat diubah. Setelah mengirim formulir, Anda akan
                masuk ke proses seleksi interview.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SuccessModal = () => (
    <div
      className={`modal fade ${showSuccessModal ? "show" : ""}`}
      style={{ display: showSuccessModal ? "block" : "none" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Pendaftaran Berhasil!</h5>
          </div>
          <div className="modal-body text-center">
            <div className="mb-4">
              <i
                className="bi bi-check-circle-fill text-success"
                style={{ fontSize: "4rem" }}
              ></i>
            </div>
            <h4 className="text-primary mb-3">
              Selamat! Pendaftaran Anda Berhasil Diterima!
            </h4>
            <p className="mb-3">
              Terima kasih telah mendaftar di Program{" "}
              <strong>
                {programs.find((p) => p.id == formData.program_id)?.name}
              </strong>
            </p>
            <div className="alert alert-info">
              <h5>Nomor Pendaftaran Anda:</h5>
              <h4 className="text-primary">
                #{registrationResult?.registration_code}
              </h4>
            </div>
            <p className="text-muted text-danger">
              Untuk informasi dan langkah seleksi lebih lanjut, Anda akan
              dihubungi melalui WhatsApp pada nomor yang telah didaftarkan.
              Mohon pastikan nomor WhatsApp Anda aktif.
            </p>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/dashboard")}
            >
              Detail program anda
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="text-center mb-5">
            <h2>
              Formulir Pendaftaran Pelatihan dan Penyaluran Tenaga Kerja
              Fitalenta
            </h2>
            <p className="text-muted">
              Isi data diri Anda dengan lengkap dan benar
            </p>
          </div>

          {/* Progress Steps */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="text-center flex-fill">
                    <div
                      className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                        step <= currentStep
                          ? "bg-primary text-white"
                          : "bg-light text-muted"
                      }`}
                      style={{ width: "40px", height: "40px" }}
                    >
                      {step}
                    </div>
                    <div className="mt-2 small">
                      {step === 1 && "Data Diri"}
                      {step === 2 && "Program & Dokumen"}
                      {step === 3 && "Konfirmasi"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="progress mt-2" style={{ height: "4px" }}>
                <div
                  className="progress-bar"
                  style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-body">
                {/* Step Content */}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    ← Sebelumnya
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      Lanjutkan →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Mengirim...
                        </>
                      ) : (
                        "✓ Selesaikan Pendaftaran"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal />

      {/* Modal Backdrop */}
      {showSuccessModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
=======
/* =========================================================
   PROGRAM UTILITIES
========================================================= */
const normalizeProgramName = (value = "") => {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[-_\s]+/g, "");
};
const getProgramSortIndex = (program) => {
    const value = normalizeProgramName(
        typeof program === "string"
            ? program
            : program?.name || ""
    );
    const order = {
        programregular: 0,
        programreguler: 0,
        regular: 0,
        reguler: 0,
        programasrama: 1,
        asrama: 1,
        programhybrid: 2,
        hybrid: 2,
        programfasttrack: 3,
        fasttrack: 3,
        programbeasiswa: 4,
        beasiswa: 4,
        programgijinkoku: 5,
        gijinkoku: 5,
        programkorea: 6,
        korea: 6,
    };
    return order[value] ?? 999;
};
const sortPrograms = (programs = []) => {
    return [...programs].sort((a, b) => {
        const first = getProgramSortIndex(a);
        const second = getProgramSortIndex(b);
        if (first !== second) {
            return first - second;
        }
        return String(a?.name || "").localeCompare(
            String(b?.name || ""),
            "id"
        );
    });
};
const isHybridProgram = (program) => {
    return normalizeProgramName(
        program?.name || ""
    ).includes("hybrid");
};
const isFastTrackProgram = (program) => {
    return normalizeProgramName(
        program?.name || ""
    ).includes("fasttrack");
};
const getInstallmentLabel = (program) => {
    if (!program) {
        return "-";
    }
    const plan = program.installment_plan;
    if (!plan || plan === "none") {
        return "Bayar Penuh";
    }
    if (plan === "dp") {
        return "DP / Uang Muka";
    }
    const match = String(plan).match(
        /^(\d+)_installments$/
    );
    if (match) {
        return `${match[1]} Cicilan`;
    }
    return "-";
};
const getDownPaymentLabel = (program) => {
    const amount = Number(
        program?.down_payment || 0
    );
    if (amount <= 0) {
        return "Tidak Ada";
    }
    return helpers.formatCurrency(amount);
};

/* =========================================================
   PROGRAM REGISTRATION
========================================================= */
const ProgramRegistration = () => {
    /* =========================================================
       STATE & HOOKS
    ========================================================= */
    const [currentStep, setCurrentStep] = useState(1);
    const [programs, setPrograms] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCities, setLoadingCities] = useState({});
    const [uploadingFiles] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");
    const [success] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [registrationResult, setRegistrationResult] = useState(null);
    const [agreement, setAgreement] = useState(false);
    const [isSameAsKTP, setIsSameAsKTP] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showTutorial, setShowTutorial] = useState(true);
    const [tutorialPage, setTutorialPage] = useState(0);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [draftStatus, setDraftStatus] = useState("idle");
    const [draftHasFileNotice, setDraftHasFileNotice] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    /* =========================================================
       ORDERED PROGRAMS
    ========================================================= */
    const orderedPrograms = useMemo(
        () => sortPrograms(programs),
        [programs]
    );

    /* =========================================================
       LABEL MAPPING
    ========================================================= */
    const mapValueToLabel = {
        current_activity: {
            pelajar: "Pelajar",
            mahasiswa: "Mahasiswa",
            bekerja: "Bekerja",
            tidak_bekerja: "Tidak Bekerja",
            pencari_kerja: "Pencari Kerja",
        },
        marital_status: {
            belum_menikah: "Belum Menikah",
            sudah_menikah: "Sudah Menikah",
            sudah_menikah_dan_memiliki_anak: "Sudah Menikah dan Memiliki Anak",
        },
        parent_relationship: {
            ayah: "Ayah",
            ibu: "Ibu",
            kakak: "Kakak",
            kerabat: "Kerabat",
        },
        last_education: {
            SMA: "SMA/Sederajat",
            D1: "D1",
            D2: "D2",
            D3: "D3",
            D4: "D4",
            S1: "S1",
            S2: "S2",
            S3: "S3",
        },
    };
    const getDisplayLabel = (fieldName, value) => {
        if (!value) return "-";
        return mapValueToLabel[fieldName]?.[value] || value;
    };

    /* =========================================================
       FORM DATA
    ========================================================= */
    const [formData, setFormData] = useState({
        full_name: user?.full_name || "",
        nik: "",
        gender: "",
        birth_place: "",
        birth_date: "",
        email: user?.email || "",
        phone: user?.phone || "",
        last_education: "",
        parent_phone: "",
        parent_relationship: "",
        major: "",
        education_institution: "",
        current_activity: "",
        marital_status: "",
        ktp_province: "",
        ktp_province_name: "",
        ktp_city: "",
        ktp_city_name: "",
        ktp_address: "",
        domicile_province: "",
        domicile_province_name: "",
        domicile_city: "",
        domicile_city_name: "",
        domicile_address: "",
        photo_file: null,
        photo_preview: null,
        program_id: "",
        n4_file: null,
        n4_preview: null,
        ssw_file: null,
        ssw_preview: null,
    });

    /* =========================================================
       DRAFT STORAGE
    ========================================================= */
    const getDraftStorageKey = () => {
        const userIdentifier = user?.id || user?.email || "guest";
        return `fitalenta_program_registration_draft_${userIdentifier}`;
    };
    const createDraftData = () => ({
        version: 1,
        currentStep,
        isSameAsKTP,
        savedAt: new Date().toISOString(),
        hadFiles: {
            photo: Boolean(formData.photo_file),
            n4: Boolean(formData.n4_file),
            ssw: Boolean(formData.ssw_file),
        },
        formData: {
            full_name: formData.full_name,
            nik: formData.nik,
            gender: formData.gender,
            birth_place: formData.birth_place,
            birth_date: formData.birth_date,
            email: formData.email,
            phone: formData.phone,
            last_education: formData.last_education,
            parent_phone: formData.parent_phone,
            parent_relationship: formData.parent_relationship,
            major: formData.major,
            education_institution: formData.education_institution,
            current_activity: formData.current_activity,
            marital_status: formData.marital_status,
            ktp_province: formData.ktp_province,
            ktp_province_name: formData.ktp_province_name,
            ktp_city: formData.ktp_city,
            ktp_city_name: formData.ktp_city_name,
            ktp_address: formData.ktp_address,
            domicile_province: formData.domicile_province,
            domicile_province_name: formData.domicile_province_name,
            domicile_city: formData.domicile_city,
            domicile_city_name: formData.domicile_city_name,
            domicile_address: formData.domicile_address,
            program_id: formData.program_id,
        },
    });
    const clearDraft = () => {
        try {
            localStorage.removeItem(getDraftStorageKey());
            setDraftStatus("idle");
        } catch (err) {
            console.error("Error clearing registration draft:", err);
        }
    };

    /* =========================================================
       FETCH PROGRAMS
    ========================================================= */
    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/programs");
            if (response.data?.success) {
                const data = Array.isArray(response.data.data)
                    ? response.data.data
                    : [];
                setPrograms(sortPrograms(data));
            } else {
                setPrograms([]);
                setError("Gagal memuat data program");
            }
        } catch (err) {
            console.error("Error fetching programs:", err);
            setPrograms([]);
            setError(
                err.response?.data?.message ||
                "Gagal memuat data program"
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       FETCH PROVINCES
    ========================================================= */
    const fetchProvinces = async () => {
        try {
            setLoadingProvinces(true);
            const response = await axios.get(
                "/api/wilayah/provinces"
            );
            if (response.data?.success) {
                setProvinces(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );
            } else {
                setError("Gagal memuat data provinsi");
            }
        } catch (err) {
            console.error("Error fetching provinces:", err);
            setError("Gagal memuat data provinsi");
        } finally {
            setLoadingProvinces(false);
        }
    };

    /* =========================================================
       FETCH CITIES
    ========================================================= */
    const fetchCities = async (provinceCode) => {
        if (!provinceCode) return;
        try {
            setLoadingCities((prev) => ({
                ...prev,
                [provinceCode]: true,
            }));
            const response = await axios.get(
                `/api/wilayah/regencies/${provinceCode}`
            );
            if (response.data?.success) {
                setCities((prev) => ({
                    ...prev,
                    [provinceCode]: Array.isArray(response.data.data)
                        ? response.data.data
                        : [],
                }));
            }
        } catch (err) {
            console.error(
                `Error fetching cities for province ${provinceCode}:`,
                err
            );
            setError(
                `Gagal memuat data kabupaten/kota untuk provinsi ${provinceCode}`
            );
        } finally {
            setLoadingCities((prev) => ({
                ...prev,
                [provinceCode]: false,
            }));
        }
    };

    /* =========================================================
       INITIAL DATA
    ========================================================= */
    useEffect(() => {
        fetchPrograms();
        fetchProvinces();
    }, []);

    /* =========================================================
       RESTORE DRAFT
    ========================================================= */
    useEffect(() => {
        if (!user) return;
        try {
            const storageKey = getDraftStorageKey();
            const savedDraft = localStorage.getItem(storageKey);
            if (!savedDraft) {
                setFormData((prev) => ({
                    ...prev,
                    full_name: prev.full_name || user?.full_name || "",
                    email: user?.email || prev.email || "",
                    phone: prev.phone || user?.phone || "",
                }));
                setDraftLoaded(true);
                setDraftStatus("saved");
                return;
            }
            const parsedDraft = JSON.parse(savedDraft);
            if (!parsedDraft?.formData) {
                localStorage.removeItem(storageKey);
                setDraftLoaded(true);
                setDraftStatus("saved");
                return;
            }
            setFormData((prev) => ({
                ...prev,
                ...parsedDraft.formData,
                full_name:
                    parsedDraft.formData.full_name ||
                    user?.full_name ||
                    prev.full_name,
                email:
                    user?.email ||
                    parsedDraft.formData.email ||
                    prev.email,
                phone:
                    parsedDraft.formData.phone ||
                    user?.phone ||
                    prev.phone,
                photo_file: null,
                photo_preview: null,
                n4_file: null,
                n4_preview: null,
                ssw_file: null,
                ssw_preview: null,
            }));
            setIsSameAsKTP(Boolean(parsedDraft.isSameAsKTP));
            setAgreement(false);
            const savedStep = Number(parsedDraft.currentStep);
            if (savedStep >= 1 && savedStep <= 3) {
                if (savedStep > 1 && parsedDraft.hadFiles?.photo) {
                    setCurrentStep(1);
                    setDraftHasFileNotice(true);
                } else {
                    setCurrentStep(savedStep);
                }
            }
            if (
                parsedDraft.hadFiles?.photo ||
                parsedDraft.hadFiles?.n4 ||
                parsedDraft.hadFiles?.ssw
            ) {
                setDraftHasFileNotice(true);
            }
            setDraftLoaded(true);
            setDraftStatus("restored");
        } catch (err) {
            console.error("Error restoring registration draft:", err);
            try {
                localStorage.removeItem(getDraftStorageKey());
            } catch (storageError) {
                console.error(
                    "Error removing invalid registration draft:",
                    storageError
                );
            }
            setDraftLoaded(true);
            setDraftStatus("error");
        }
    }, [user]);

    /* =========================================================
       AUTO SAVE DRAFT
    ========================================================= */
    useEffect(() => {
        if (!user || !draftLoaded || showSuccessModal) return;
        setDraftStatus("saving");
        const saveTimer = setTimeout(() => {
            try {
                localStorage.setItem(
                    getDraftStorageKey(),
                    JSON.stringify(createDraftData())
                );
                setDraftStatus("saved");
            } catch (err) {
                console.error("Error saving registration draft:", err);
                setDraftStatus("error");
            }
        }, 600);
        return () => clearTimeout(saveTimer);
    }, [
        user,
        draftLoaded,
        currentStep,
        isSameAsKTP,
        formData,
        showSuccessModal,
    ]);

    /* =========================================================
       RESTORE CITY OPTIONS
    ========================================================= */
    useEffect(() => {
        if (!draftLoaded) return;
        const provinceCodes = [
            formData.ktp_province,
            formData.domicile_province,
        ].filter(Boolean);
        const uniqueProvinceCodes = [...new Set(provinceCodes)];
        uniqueProvinceCodes.forEach((provinceCode) => {
            if (!cities[provinceCode] && !loadingCities[provinceCode]) {
                fetchCities(provinceCode);
            }
        });
    }, [
        draftLoaded,
        formData.ktp_province,
        formData.domicile_province,
    ]);

    /* =========================================================
       CLEANUP PREVIEW URL
    ========================================================= */
    useEffect(() => {
        return () => {
            ["photo", "n4", "ssw"].forEach((field) => {
                const preview = formData[`${field}_preview`];
                if (preview && typeof preview === "string") {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, []);

    /* =========================================================
       SYNC KTP TO DOMICILE
    ========================================================= */
    useEffect(() => {
        if (isSameAsKTP) {
            setFormData((prev) => ({
                ...prev,
                domicile_province: prev.ktp_province,
                domicile_province_name: prev.ktp_province_name,
                domicile_city: prev.ktp_city,
                domicile_city_name: prev.ktp_city_name,
                domicile_address: prev.ktp_address,
            }));
        }
    }, [
        isSameAsKTP,
        formData.ktp_province,
        formData.ktp_province_name,
        formData.ktp_city,
        formData.ktp_city_name,
        formData.ktp_address,
    ]);

    /* =========================================================
       FILE HANDLER
    ========================================================= */
    const handleFileChange = (fieldName, file) => {
        if (!file) return;
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/pdf",
        ];
        if (
            fieldName === "photo" &&
            !file.type.startsWith("image/")
        ) {
            setError("File foto harus berupa gambar JPG atau PNG");
            return;
        }
        if (
            fieldName !== "photo" &&
            !allowedTypes.includes(file.type)
        ) {
            setError(
                `File ${fieldName} harus berupa JPG, PNG, atau PDF`
            );
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError(
                `Ukuran file ${fieldName} maksimal 10MB`
            );
            return;
        }
        setError("");
        const previousPreview =
            formData[`${fieldName}_preview`];
        if (previousPreview) {
            URL.revokeObjectURL(previousPreview);
        }
        const previewUrl = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null;
        setFormData((prev) => ({
            ...prev,
            [`${fieldName}_file`]: file,
            [`${fieldName}_preview`]: previewUrl,
        }));
        if (fieldName === "photo") {
            setDraftHasFileNotice(false);
        }
    };

    /* =========================================================
       INPUT HANDLER
    ========================================================= */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "ktp_province") {
            const selectedProvince = provinces.find(
                (province) => province.code === value
            );
            setFormData((prev) => ({
                ...prev,
                ktp_province: value,
                ktp_province_name: selectedProvince?.name || "",
                ktp_city: "",
                ktp_city_name: "",
            }));
            if (value && !cities[value]) {
                fetchCities(value);
            }
            return;
        }
        if (name === "ktp_city") {
            const selectedCity =
                cities[formData.ktp_province]?.find(
                    (city) => city.code === value
                );
            setFormData((prev) => ({
                ...prev,
                ktp_city: value,
                ktp_city_name: selectedCity?.name || "",
            }));
            return;
        }
        if (name === "domicile_province") {
            const selectedProvince = provinces.find(
                (province) => province.code === value
            );
            setFormData((prev) => ({
                ...prev,
                domicile_province: value,
                domicile_province_name: selectedProvince?.name || "",
                domicile_city: "",
                domicile_city_name: "",
            }));
            if (value && !cities[value]) {
                fetchCities(value);
            }
            return;
        }
        if (name === "domicile_city") {
            const selectedCity =
                cities[formData.domicile_province]?.find(
                    (city) => city.code === value
                );
            setFormData((prev) => ({
                ...prev,
                domicile_city: value,
                domicile_city_name: selectedCity?.name || "",
            }));
            return;
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =========================================================
       SAME ADDRESS HANDLER
    ========================================================= */
    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsSameAsKTP(checked);
        if (checked) {
            setFormData((prev) => ({
                ...prev,
                domicile_province: prev.ktp_province,
                domicile_province_name: prev.ktp_province_name,
                domicile_city: prev.ktp_city,
                domicile_city_name: prev.ktp_city_name,
                domicile_address: prev.ktp_address,
            }));
        }
    };

    /* =========================================================
       SELECTED PROGRAM
    ========================================================= */
    const selectedProgram = orderedPrograms.find(
        (program) =>
            String(program.id) ===
            String(formData.program_id)
    );
    const isFastTrack =
        isFastTrackProgram(selectedProgram);
    const isHybrid =
        isHybridProgram(selectedProgram);

    /* =========================================================
       VALIDATION
    ========================================================= */
    const validateStep = (step) => {
        const errors = [];
        if (step === 1) {
            if (!formData.full_name) errors.push("Nama lengkap harus diisi");
            if (!formData.nik) errors.push("NIK harus diisi");
            if (!formData.gender) errors.push("Jenis kelamin harus dipilih");
            if (!formData.birth_place) errors.push("Tempat lahir harus diisi");
            if (!formData.birth_date) errors.push("Tanggal lahir harus diisi");
            if (!formData.phone) errors.push("Nomor handphone harus diisi");
            if (!formData.last_education) errors.push("Pendidikan terakhir harus diisi");
            if (!formData.major) errors.push("Jurusan harus diisi");
            if (!formData.education_institution) {
                errors.push("Asal institusi pendidikan terakhir harus diisi");
            }
            if (!formData.current_activity) {
                errors.push("Pekerjaan/aktivitas saat ini harus dipilih");
            }
            if (!formData.marital_status) {
                errors.push("Status pernikahan harus dipilih");
            }
            if (!formData.parent_relationship) {
                errors.push("Hubungan dengan orang tua/wali harus dipilih");
            }
            if (!formData.parent_phone) {
                errors.push("Nomor handphone orang tua harus diisi");
            }
            if (!formData.ktp_province) {
                errors.push("Provinsi KTP harus dipilih");
            }
            if (!formData.ktp_city) {
                errors.push("Kota/Kabupaten KTP harus dipilih");
            }
            if (!formData.ktp_address) {
                errors.push("Alamat KTP harus diisi");
            }
            if (!formData.domicile_province) {
                errors.push("Provinsi domisili harus dipilih");
            }
            if (!formData.domicile_city) {
                errors.push("Kota/Kabupaten domisili harus dipilih");
            }
            if (!formData.domicile_address) {
                errors.push("Alamat domisili harus diisi");
            }
            if (!formData.photo_file) {
                errors.push("Foto harus diupload");
            }
        }
        if (step === 2) {
            if (!formData.program_id) {
                errors.push("Program harus dipilih");
            }
            const program = orderedPrograms.find(
                (item) =>
                    String(item.id) ===
                    String(formData.program_id)
            );
            if (isFastTrackProgram(program)) {
                if (!formData.n4_file) {
                    errors.push(
                        "Sertifikat N4 harus diupload untuk Program Fast Track"
                    );
                }
                if (!formData.ssw_file) {
                    errors.push(
                        "Sertifikat SSW harus diupload untuk Program Fast Track"
                    );
                }
            }
        }
        if (step === 3 && !agreement) {
            errors.push(
                "Anda harus menyetujui syarat dan ketentuan"
            );
        }
        if (errors.length > 0) {
            setError(errors.join(", "));
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            return false;
        }
        return true;
    };

    /* =========================================================
       STEP NAVIGATION
    ========================================================= */
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => prev + 1);
            setError("");
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };
    const prevStep = () => {
        setCurrentStep((prev) =>
            Math.max(1, prev - 1)
        );
        setError("");
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* =========================================================
       HELPERS
    ========================================================= */
    const getCurrentCities = (provinceCode) =>
        cities[provinceCode] || [];
    const isCitiesLoading = (provinceCode) =>
        loadingCities[provinceCode] || false;
    const isUploading = (fieldName) =>
        uploadingFiles[fieldName] || false;

    /* =========================================================
       SUBMIT REGISTRATION
    ========================================================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(3)) return;
        if (!user?.id) {
            setError(
                "Data pengguna tidak ditemukan. Silakan login kembali."
            );
            return;
        }
        try {
            setSubmitLoading(true);
            setError("");
            let photoPath = null;
            let n4Path = null;
            let sswPath = null;
            if (formData.photo_file) {
                const photoFormData = new FormData();
                photoFormData.append(
                    "file",
                    formData.photo_file
                );
                const uploadResponse = await axios.post(
                    "/api/uploads/photo",
                    photoFormData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (!uploadResponse.data?.success) {
                    throw new Error(
                        "Gagal mengupload foto"
                    );
                }
                photoPath =
                    uploadResponse.data.data.file_path;
            }
            if (
                isFastTrack &&
                formData.n4_file
            ) {
                const n4FormData = new FormData();
                n4FormData.append(
                    "file",
                    formData.n4_file
                );
                n4FormData.append(
                    "type",
                    "n4_certificate"
                );
                const n4Response = await axios.post(
                    "/api/uploads/document",
                    n4FormData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (!n4Response.data?.success) {
                    throw new Error(
                        "Gagal mengupload sertifikat N4"
                    );
                }
                n4Path =
                    n4Response.data.data.file_path;
            }
            if (
                isFastTrack &&
                formData.ssw_file
            ) {
                const sswFormData = new FormData();
                sswFormData.append(
                    "file",
                    formData.ssw_file
                );
                sswFormData.append(
                    "type",
                    "ssw_certificate"
                );
                const sswResponse = await axios.post(
                    "/api/uploads/document",
                    sswFormData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (!sswResponse.data?.success) {
                    throw new Error(
                        "Gagal mengupload sertifikat SSW"
                    );
                }
                sswPath =
                    sswResponse.data.data.file_path;
            }
            const registrationData = {
                user_id: user.id,
                program_id: formData.program_id,
                nik: formData.nik,
                gender: formData.gender,
                birth_place: formData.birth_place,
                birth_date: formData.birth_date,
                last_education: formData.last_education,
                parent_phone: formData.parent_phone,
                parent_relationship: formData.parent_relationship,
                major: formData.major,
                education_institution: formData.education_institution,
                current_activity: formData.current_activity,
                marital_status: formData.marital_status,
                ktp_province_code: formData.ktp_province,
                ktp_province_name: formData.ktp_province_name,
                ktp_city_code: formData.ktp_city,
                ktp_city_name: formData.ktp_city_name,
                ktp_address: formData.ktp_address,
                domicile_province_code: formData.domicile_province,
                domicile_province_name: formData.domicile_province_name,
                domicile_city_code: formData.domicile_city,
                domicile_city_name: formData.domicile_city_name,
                domicile_address: formData.domicile_address,
                photo_path: photoPath,
                n4_certificate_path: n4Path,
                ssw_certificate_path: sswPath,
                user_data: {
                    full_name: formData.full_name,
                    phone: formData.phone,
                },
            };
            const response = await axios.post(
                "/api/registrations",
                registrationData
            );
            if (response.data?.success) {
                clearDraft();
                setRegistrationResult(
                    response.data.data
                );
                setShowSuccessModal(true);
            } else {
                setError(
                    response.data?.message ||
                    "Gagal melakukan pendaftaran"
                );
            }
        } catch (err) {
            console.error(
                "Registration error:",
                err
            );
            console.error(
                "Error details:",
                err.response?.data
            );
            setError(
                err.response?.data?.message ||
                err.message ||
                "Terjadi kesalahan saat mendaftar. Silakan coba lagi."
            );
        } finally {
            setSubmitLoading(false);
        }
    };

    /* =========================================================
       REUSABLE SECTION TITLE
    ========================================================= */
    const SectionHeading = ({
                                icon,
                                title,
                                description,
                                required = false,
                                children,
                            }) => (
        <div className="registration-section-heading">
            <div className="registration-section-title-wrap">
                <div className="registration-section-icon">
                    <i className={`bi ${icon}`}></i>
                </div>
                <div>
                    <h5>{title}</h5>
                    <p>{description}</p>
                </div>
            </div>
            <div className="registration-section-actions">
                {children}
                {required && (
                    <span className="registration-required-badge">
                        WAJIB
                    </span>
                )}
            </div>
        </div>
    );

    /* =========================================================
       STEP 1 - DATA DIRI
    ========================================================= */
    const renderStep1 = () => (
        <div className="registration-step-content">
            <div className="registration-step-heading">
                <div className="registration-step-index">
                    01
                </div>
                <div>
                    <span className="registration-step-eyebrow">
                        LANGKAH PERTAMA
                    </span>
                    <h4>
                        Kenali Anda Lebih Dekat
                    </h4>
                    <p>
                        Informasi ini digunakan sebagai identitas utama
                        selama proses seleksi dan program FITALENTA.
                    </p>
                </div>
            </div>
            <div className="registration-info-strip">
                <div className="registration-info-strip-icon">
                    <i className="bi bi-shield-check"></i>
                </div>
                <div>
                    <strong>
                        Data Anda digunakan hanya untuk kebutuhan pendaftaran
                    </strong>
                    <span>
                        Pastikan seluruh informasi sesuai dengan dokumen resmi
                        untuk mempermudah proses verifikasi.
                    </span>
                </div>
            </div>
            {draftHasFileNotice && (
                <div className="alert alert-info d-flex align-items-start gap-3 mb-4">
                    <i className="bi bi-cloud-check fs-5"></i>
                    <div>
                        <strong className="d-block mb-1">
                            Data sebelumnya berhasil dipulihkan
                        </strong>
                        <span>
                            Informasi yang sudah Anda isi tetap tersedia.
                            Untuk keamanan browser, foto atau dokumen yang
                            sebelumnya dipilih perlu diunggah kembali.
                        </span>
                    </div>
                </div>
            )}
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-camera"
                    title="Foto Profil"
                    description="Gunakan foto terbaru dengan wajah terlihat jelas."
                    required
                />
                <div className="registration-upload-grid">
                    <label
                        htmlFor="photo"
                        className={`registration-upload-box ${
                            formData.photo_file
                                ? "has-file"
                                : ""
                        }`}
                    >
                        <input
                            type="file"
                            id="photo"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) =>
                                handleFileChange(
                                    "photo",
                                    e.target.files[0]
                                )
                            }
                            disabled={isUploading("photo")}
                        />
                        <div className="registration-upload-icon">
                            <i className="bi bi-cloud-arrow-up"></i>
                        </div>
                        <strong>
                            {formData.photo_file
                                ? formData.photo_file.name
                                : "Upload foto Anda"}
                        </strong>
                        <span>
                            Klik untuk memilih foto
                        </span>
                        <small>
                            JPG atau PNG • Maksimal 10 MB
                        </small>
                    </label>
                    {formData.photo_preview ? (
                        <div className="registration-photo-preview">
                            <span className="registration-preview-badge">
                                FOTO ANDA
                            </span>
                            <img
                                src={formData.photo_preview}
                                alt="Preview Foto"
                            />
                            <div className="registration-preview-success">
                                <i className="bi bi-check-circle-fill"></i>
                                <div>
                                    <strong>
                                        Foto siap digunakan
                                    </strong>
                                    <small>
                                        Klik area upload jika ingin mengganti
                                    </small>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="registration-photo-preview empty">
                            <span className="registration-preview-badge">
                                PREVIEW
                            </span>
                            <div className="registration-empty-photo-icon">
                                <i className="bi bi-person-bounding-box"></i>
                            </div>
                            <strong>
                                Belum ada foto
                            </strong>
                            <small>
                                Preview akan muncul setelah Anda memilih foto
                            </small>
                        </div>
                    )}
                </div>
            </section>
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-person-vcard"
                    title="Informasi Pribadi"
                    description="Informasi dasar yang digunakan pada profil peserta."
                />
                <div className="row registration-form-row">
                    <div className="col-md-6 registration-field">
                        <label htmlFor="full_name" className="form-label">
                            Nama Lengkap <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            placeholder="Masukkan nama lengkap"
                            required
                        />
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="nik" className="form-label">
                            NIK <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="nik"
                            name="nik"
                            value={formData.nik}
                            onChange={handleInputChange}
                            placeholder="Masukkan 16 digit NIK"
                            maxLength={16}
                            inputMode="numeric"
                            required
                        />
                        <small className="registration-field-help">
                            <i className="bi bi-info-circle"></i>
                            Sesuai dengan KTP
                        </small>
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="gender" className="form-label">
                            Jenis Kelamin <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="birth_place" className="form-label">
                            Tempat Lahir <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="birth_place"
                            name="birth_place"
                            value={formData.birth_place}
                            onChange={handleInputChange}
                            placeholder="Contoh: Bandung"
                            required
                        />
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="birth_date" className="form-label">
                            Tanggal Lahir <span className="text-danger">*</span>
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="birth_date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="email" className="form-label">
                            Email <span className="text-danger">*</span>
                        </label>
                        <div className="registration-readonly-field">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={formData.email}
                                disabled
                            />
                            <i className="bi bi-lock-fill"></i>
                        </div>
                        <small className="registration-field-help">
                            <i className="bi bi-shield-lock"></i>
                            Mengikuti email akun yang sedang login
                        </small>
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="phone" className="form-label">
                            Nomor Handphone <span className="text-danger">*</span>
                        </label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Contoh: 081234567890"
                            required
                        />
                        <small className="registration-field-help">
                            <i className="bi bi-whatsapp"></i>
                            Gunakan nomor WhatsApp aktif
                        </small>
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="last_education" className="form-label">
                            Pendidikan Terakhir <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="last_education"
                            name="last_education"
                            value={formData.last_education}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Pilih Pendidikan</option>
                            <option value="SMA">SMA/Sederajat</option>
                            <option value="D1">D1</option>
                            <option value="D2">D2</option>
                            <option value="D3">D3</option>
                            <option value="D4">D4</option>
                            <option value="S1">S1</option>
                            <option value="S2">S2</option>
                            <option value="S3">S3</option>
                        </select>
                    </div>
                </div>
            </section>
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-mortarboard"
                    title="Pendidikan & Aktivitas"
                    description="Ceritakan sedikit mengenai latar belakang pendidikan dan aktivitas Anda."
                />
                <div className="row registration-form-row">
                    <div className="col-md-6 registration-field">
                        <label htmlFor="major" className="form-label">
                            Jurusan <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="major"
                            name="major"
                            value={formData.major}
                            onChange={handleInputChange}
                            placeholder="Contoh: Teknik Informatika"
                            required
                        />
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="education_institution" className="form-label">
                            Asal Institusi Pendidikan <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="education_institution"
                            name="education_institution"
                            value={formData.education_institution}
                            onChange={handleInputChange}
                            placeholder="Contoh: Universitas Indonesia"
                            required
                        />
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="current_activity" className="form-label">
                            Pekerjaan/Aktivitas Saat Ini <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="current_activity"
                            name="current_activity"
                            value={formData.current_activity}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Pilih Aktivitas</option>
                            <option value="pelajar">Pelajar</option>
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="bekerja">Bekerja</option>
                            <option value="tidak_bekerja">Tidak Bekerja</option>
                            <option value="pencari_kerja">Pencari Kerja</option>
                        </select>
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="marital_status" className="form-label">
                            Status Pernikahan <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="marital_status"
                            name="marital_status"
                            value={formData.marital_status}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Pilih Status</option>
                            <option value="belum_menikah">
                                Belum Menikah
                            </option>
                            <option value="sudah_menikah">
                                Sudah Menikah
                            </option>
                            <option value="sudah_menikah_dan_memiliki_anak">
                                Sudah Menikah dan Memiliki Anak
                            </option>
                        </select>
                    </div>
                </div>
            </section>
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-telephone"
                    title="Kontak Orang Tua / Wali"
                    description="Kontak ini hanya digunakan apabila diperlukan selama proses program."
                />
                <div className="row registration-form-row">
                    <div className="col-md-6 registration-field">
                        <label htmlFor="parent_relationship" className="form-label">
                            Hubungan dengan Orang Tua/Wali <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="parent_relationship"
                            name="parent_relationship"
                            value={formData.parent_relationship}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Pilih Hubungan</option>
                            <option value="ayah">Ayah</option>
                            <option value="ibu">Ibu</option>
                            <option value="kakak">Kakak</option>
                            <option value="kerabat">Kerabat</option>
                        </select>
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="parent_phone" className="form-label">
                            Nomor Handphone Orang Tua/Wali <span className="text-danger">*</span>
                        </label>
                        <input
                            type="tel"
                            className="form-control"
                            id="parent_phone"
                            name="parent_phone"
                            value={formData.parent_phone}
                            onChange={handleInputChange}
                            placeholder="Contoh: 081234567890"
                            required
                        />
                    </div>
                </div>
            </section>
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-person-badge"
                    title="Alamat Sesuai KTP"
                    description="Masukkan alamat yang tercantum pada identitas resmi Anda."
                />
                <div className="row registration-form-row">
                    <div className="col-md-6 registration-field">
                        <label htmlFor="ktp_province" className="form-label">
                            Provinsi <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="ktp_province"
                            name="ktp_province"
                            value={formData.ktp_province}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">
                                {loadingProvinces
                                    ? "Memuat provinsi..."
                                    : "Pilih Provinsi"}
                            </option>
                            {provinces.map((province) => (
                                <option
                                    key={province.code}
                                    value={province.code}
                                >
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="ktp_city" className="form-label">
                            Kabupaten/Kota <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="ktp_city"
                            name="ktp_city"
                            value={formData.ktp_city}
                            onChange={handleInputChange}
                            disabled={
                                !formData.ktp_province ||
                                isCitiesLoading(
                                    formData.ktp_province
                                )
                            }
                            required
                        >
                            <option value="">
                                {isCitiesLoading(formData.ktp_province)
                                    ? "Memuat Kabupaten/Kota..."
                                    : "Pilih Kabupaten/Kota"}
                            </option>
                            {getCurrentCities(
                                formData.ktp_province
                            ).map((city) => (
                                <option
                                    key={city.code}
                                    value={city.code}
                                >
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 registration-field">
                        <label htmlFor="ktp_address" className="form-label">
                            Detail Alamat <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className="form-control"
                            id="ktp_address"
                            name="ktp_address"
                            rows="3"
                            value={formData.ktp_address}
                            onChange={handleInputChange}
                            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                            required
                        />
                        <small className="registration-field-help">
                            <i className="bi bi-geo-alt"></i>
                            Tuliskan alamat selengkap mungkin
                        </small>
                    </div>
                </div>
            </section>
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-house-door"
                    title="Alamat Domisili"
                    description="Alamat tempat tinggal Anda saat ini."
                >
                    <label
                        className="registration-same-address"
                        htmlFor="same_as_ktp"
                    >
                        <input
                            type="checkbox"
                            id="same_as_ktp"
                            checked={isSameAsKTP}
                            onChange={handleCheckboxChange}
                        />
                        <span className="registration-custom-checkbox"></span>
                        <span className="registration-same-address-text">
                            <strong>
                                Sama dengan KTP
                            </strong>
                            <small>
                                Salin otomatis
                            </small>
                        </span>
                    </label>
                </SectionHeading>
                <div
                    className={`row registration-form-row ${
                        isSameAsKTP
                            ? "registration-fields-synced"
                            : ""
                    }`}
                >
                    <div className="col-md-6 registration-field">
                        <label htmlFor="domicile_province" className="form-label">
                            Provinsi <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="domicile_province"
                            name="domicile_province"
                            value={formData.domicile_province}
                            onChange={handleInputChange}
                            disabled={isSameAsKTP}
                            required
                        >
                            <option value="">
                                Pilih Provinsi
                            </option>
                            {provinces.map((province) => (
                                <option
                                    key={province.code}
                                    value={province.code}
                                >
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 registration-field">
                        <label htmlFor="domicile_city" className="form-label">
                            Kabupaten/Kota <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="domicile_city"
                            name="domicile_city"
                            value={formData.domicile_city}
                            onChange={handleInputChange}
                            disabled={
                                isSameAsKTP ||
                                !formData.domicile_province ||
                                isCitiesLoading(
                                    formData.domicile_province
                                )
                            }
                            required
                        >
                            <option value="">
                                {isCitiesLoading(
                                    formData.domicile_province
                                )
                                    ? "Memuat Kabupaten/Kota..."
                                    : "Pilih Kabupaten/Kota"}
                            </option>
                            {getCurrentCities(
                                formData.domicile_province
                            ).map((city) => (
                                <option
                                    key={city.code}
                                    value={city.code}
                                >
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 registration-field">
                        <label htmlFor="domicile_address" className="form-label">
                            Detail Alamat <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className="form-control"
                            id="domicile_address"
                            name="domicile_address"
                            rows="3"
                            value={formData.domicile_address}
                            onChange={handleInputChange}
                            disabled={isSameAsKTP}
                            placeholder="Masukkan alamat lengkap domisili saat ini"
                            required
                        />
                    </div>
                </div>
                {isSameAsKTP && (
                    <div className="registration-sync-notice">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>
                            Alamat domisili otomatis mengikuti alamat KTP.
                        </span>
                    </div>
                )}
            </section>
        </div>
    );

    /* =========================================================
       PROGRAM PAYMENT INFORMATION
    ========================================================= */
    const ProgramPaymentInformation = ({
                                           program,
                                           compact = false,
                                       }) => {
        if (!program) {
            return null;
        }
        const hybrid =
            isHybridProgram(program);
        const downPayment =
            Number(
                program.down_payment ||
                0
            );
        const jobMatching =
            Number(
                program.job_matching_cost ||
                0
            );
        return (
            <div
                className={
                    compact
                        ? "program-select-finance"
                        : "registration-program-finance"
                }
            >
                <div>
                    <div className="program-meta-icon">
                        <i className="bi bi-wallet2"></i>
                    </div>
                    <div>
                        <small>
                            Biaya Pelatihan
                        </small>
                        <strong>
                            {helpers.formatCurrency(
                                program.training_cost ||
                                0
                            )}
                        </strong>
                    </div>
                </div>
                {hybrid && (
                    <div>
                        <div className="program-meta-icon">
                            <i className="bi bi-person-workspace"></i>
                        </div>
                        <div>
                            <small>
                                Pendampingan Job Matching
                            </small>
                            <strong>
                                {helpers.formatCurrency(
                                    jobMatching
                                )}
                            </strong>
                        </div>
                    </div>
                )}
                <div>
                    <div className="program-meta-icon">
                        <i className="bi bi-airplane"></i>
                    </div>
                    <div>
                        <small>
                            Biaya Keberangkatan
                        </small>
                        <strong>
                            {helpers.formatCurrency(
                                program.departure_cost ||
                                0
                            )}
                        </strong>
                    </div>
                </div>
                {downPayment > 0 && (
                    <div>
                        <div className="program-meta-icon">
                            <i className="bi bi-cash-stack"></i>
                        </div>
                        <div>
                            <small>
                                DP / Uang Muka
                            </small>
                            <strong>
                                {helpers.formatCurrency(
                                    downPayment
                                )}
                            </strong>
                        </div>
                    </div>
                )}
                <div>
                    <div className="program-meta-icon">
                        <i className="bi bi-arrow-repeat"></i>
                    </div>
                    <div>
                        <small>
                            Skema Pembayaran
                        </small>
                        <strong>
                            {getInstallmentLabel(
                                program
                            )}
                        </strong>
                    </div>
                </div>
            </div>
        );
    };

    /* =========================================================
       STEP 2 - PROGRAM & DOKUMEN
    ========================================================= */
    const renderStep2 = () => (
        <div className="registration-step-content">
            <div className="registration-step-heading">
                <div className="registration-step-index">
                    02
                </div>
                <div>
                    <span className="registration-step-eyebrow">
                        PILIHAN PROGRAM
                    </span>
                    <h4>
                        Pilih Jalur Terbaik untuk Anda
                    </h4>
                    <p>
                        Bandingkan program yang tersedia dan pilih sesuai
                        kebutuhan serta kesiapan Anda.
                    </p>
                </div>
            </div>
            <div className="registration-info-strip program-info">
                <div className="registration-info-strip-icon">
                    <i className="bi bi-lightbulb"></i>
                </div>
                <div>
                    <strong>
                        Tidak perlu terburu-buru memilih
                    </strong>
                    <span>
                        Perhatikan durasi, jadwal, biaya, skema pembayaran
                        dan persyaratan masing-masing program.
                    </span>
                </div>
            </div>
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-briefcase"
                    title="Pilih Program"
                    description="Klik salah satu kartu untuk memilih program."
                    required
                />
                {loading ? (
                    <div className="registration-loading-state">
                        <div
                            className="spinner-border"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>
                        <strong>
                            Menyiapkan pilihan program
                        </strong>
                        <span>
                            Mohon tunggu sebentar...
                        </span>
                    </div>
                ) : orderedPrograms.length === 0 ? (
                    <div className="registration-empty-state">
                        <div className="registration-empty-icon">
                            <i className="bi bi-briefcase"></i>
                        </div>
                        <strong>
                            Belum ada program tersedia
                        </strong>
                        <span>
                            Silakan kembali lagi setelah program dibuka.
                        </span>
                    </div>
                ) : (
                    <div className="row program-selection-grid">
                        {orderedPrograms.map(
                            (
                                program,
                                index
                            ) => (
                                <div
                                    className="col-lg-6"
                                    key={program.id}
                                >
                                    <label
                                        htmlFor={`program-${program.id}`}
                                        className={`program-select-card ${
                                            String(
                                                formData.program_id
                                            ) ===
                                            String(
                                                program.id
                                            )
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            id={`program-${program.id}`}
                                            name="program_selection"
                                            value={program.id}
                                            checked={
                                                String(
                                                    formData.program_id
                                                ) ===
                                                String(
                                                    program.id
                                                )
                                            }
                                            onChange={(e) =>
                                                setFormData(
                                                    (prev) => ({
                                                        ...prev,
                                                        program_id:
                                                        e.target.value,
                                                        n4_file: null,
                                                        n4_preview: null,
                                                        ssw_file: null,
                                                        ssw_preview: null,
                                                    })
                                                )
                                            }
                                        />
                                        <div className="program-select-header">
                                            <div>
                                                <span className="program-select-label">
                                                    PROGRAM{" "}
                                                    {String(
                                                        index +
                                                        1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>
                                                <h5>
                                                    {
                                                        program.name
                                                    }
                                                </h5>
                                            </div>
                                            <div className="program-select-indicator">
                                                <i className="bi bi-check-lg"></i>
                                            </div>
                                        </div>
                                        <p className="program-select-description">
                                            {program.description
                                                ? `${program.description.substring(
                                                    0,
                                                    170
                                                )}${
                                                    program.description.length >
                                                    170
                                                        ? "..."
                                                        : ""
                                                }`
                                                : "Informasi lengkap program tersedia pada halaman program."}
                                        </p>
                                        <div className="program-select-meta">
                                            <div>
                                                <div className="program-meta-icon">
                                                    <i className="bi bi-clock"></i>
                                                </div>
                                                <div>
                                                    <small>
                                                        Durasi
                                                    </small>
                                                    <strong>
                                                        {program.duration ||
                                                            "-"}
                                                    </strong>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="program-meta-icon">
                                                    <i className="bi bi-people"></i>
                                                </div>
                                                <div>
                                                    <small>
                                                        Kuota
                                                    </small>
                                                    <strong>
                                                        {Number(
                                                            program.capacity ||
                                                            0
                                                        ) >
                                                        0
                                                            ? `${program.capacity} peserta`
                                                            : "-"}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                        <ProgramPaymentInformation
                                            program={
                                                program
                                            }
                                            compact
                                        />
                                        <div className="program-select-schedule">
                                            <div>
                                                <i className="bi bi-calendar3"></i>
                                            </div>
                                            <div>
                                                <small>
                                                    Jadwal Program
                                                </small>
                                                <span>
                                                    {program.schedule ||
                                                        "-"}
                                                </span>
                                            </div>
                                        </div>
                                        {program.location && (
                                            <div className="program-select-schedule">
                                                <div>
                                                    <i className="bi bi-geo-alt"></i>
                                                </div>
                                                <div>
                                                    <small>
                                                        Lokasi
                                                    </small>
                                                    <span>
                                                        {
                                                            program.location
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="program-select-footer">
                                            {String(
                                                formData.program_id
                                            ) ===
                                            String(
                                                program.id
                                            ) ? (
                                                <>
                                                    <i className="bi bi-check-circle-fill"></i>
                                                    Program dipilih
                                                </>
                                            ) : (
                                                <>
                                                    Pilih program ini
                                                    <i className="bi bi-arrow-right"></i>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            )
                        )}
                    </div>
                )}
            </section>
            {selectedProgram && (
                <div className="registration-selected-summary">
                    <div className="registration-selected-summary-icon">
                        <i className="bi bi-check2-circle"></i>
                    </div>
                    <div>
                        <small>
                            PROGRAM TERPILIH
                        </small>
                        <strong>
                            {selectedProgram.name}
                        </strong>
                        <span>
                            Anda masih dapat mengganti pilihan sebelum
                            melanjutkan.
                        </span>
                    </div>
                </div>
            )}
            {isFastTrack && (
                <section className="registration-form-section">
                    <SectionHeading
                        icon="bi-file-earmark-check"
                        title="Dokumen Fast Track"
                        description="Lengkapi dokumen khusus untuk melanjutkan melalui Program Fast Track."
                        required
                    />
                    <div className="registration-fasttrack-banner">
                        <i className="bi bi-lightning-charge-fill"></i>
                        <div>
                            <strong>
                                Persyaratan khusus Program Fast Track
                            </strong>
                            <span>
                                Sertifikat N4 dan SSW wajib diunggah sebelum
                                melanjutkan.
                            </span>
                        </div>
                    </div>
                    <div className="row registration-form-row">
                        <div className="col-md-6 registration-field">
                            <label
                                htmlFor="n4"
                                className="registration-document-upload"
                            >
                                <input
                                    type="file"
                                    id="n4"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) =>
                                        handleFileChange(
                                            "n4",
                                            e.target.files[0]
                                        )
                                    }
                                    disabled={isUploading("n4")}
                                />
                                <div className="registration-document-icon">
                                    <i className="bi bi-file-earmark-text"></i>
                                </div>
                                <div>
                                    <strong>
                                        Sertifikat N4
                                    </strong>
                                    <span>
                                        JPG, PNG atau PDF • Maks. 10 MB
                                    </span>
                                    <small>
                                        {formData.n4_file
                                            ? formData.n4_file.name
                                            : "Klik untuk memilih dokumen"}
                                    </small>
                                </div>
                                {formData.n4_file && (
                                    <i className="bi bi-check-circle-fill registration-document-check"></i>
                                )}
                            </label>
                        </div>
                        <div className="col-md-6 registration-field">
                            <label
                                htmlFor="ssw"
                                className="registration-document-upload"
                            >
                                <input
                                    type="file"
                                    id="ssw"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) =>
                                        handleFileChange(
                                            "ssw",
                                            e.target.files[0]
                                        )
                                    }
                                    disabled={isUploading("ssw")}
                                />
                                <div className="registration-document-icon">
                                    <i className="bi bi-file-earmark-text"></i>
                                </div>
                                <div>
                                    <strong>
                                        Sertifikat SSW
                                    </strong>
                                    <span>
                                        JPG, PNG atau PDF • Maks. 10 MB
                                    </span>
                                    <small>
                                        {formData.ssw_file
                                            ? formData.ssw_file.name
                                            : "Klik untuk memilih dokumen"}
                                    </small>
                                </div>
                                {formData.ssw_file && (
                                    <i className="bi bi-check-circle-fill registration-document-check"></i>
                                )}
                            </label>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );

    /* =========================================================
       CONFIRM ITEM
    ========================================================= */
    function ConfirmItem({
                             label,
                             value,
                             icon = "bi-check2",
                         }) {
        return (
            <div className="registration-confirm-item">
                <div className="registration-confirm-icon">
                    <i className={`bi ${icon}`}></i>
                </div>
                <div>
                    <small>
                        {label}
                    </small>
                    <strong>
                        {value || "-"}
                    </strong>
                </div>
            </div>
        );
    }

    /* =========================================================
       STEP 3 - KONFIRMASI
    ========================================================= */
    const renderStep3 = () => (
        <div className="registration-step-content">
            <div className="registration-step-heading">
                <div className="registration-step-index">
                    03
                </div>
                <div>
                    <span className="registration-step-eyebrow">
                        LANGKAH TERAKHIR
                    </span>
                    <h4>
                        Periksa Sebelum Mengirim
                    </h4>
                    <p>
                        Pastikan seluruh informasi sudah benar sebelum
                        pendaftaran dikirim.
                    </p>
                </div>
            </div>
            <div className="registration-review-hero">
                <div className="registration-review-avatar">
                    {formData.photo_preview ? (
                        <img
                            src={formData.photo_preview}
                            alt={formData.full_name}
                        />
                    ) : (
                        <i className="bi bi-person"></i>
                    )}
                </div>
                <div className="registration-review-person">
                    <small>
                        CALON PESERTA
                    </small>
                    <h5>
                        {formData.full_name || "Nama Peserta"}
                    </h5>
                    <span>
                        {formData.email}
                    </span>
                </div>
                <div className="registration-review-program">
                    <small>
                        PROGRAM PILIHAN
                    </small>
                    <strong>
                        {selectedProgram?.name || "-"}
                    </strong>
                </div>
            </div>
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-person-check"
                    title="Data Diri"
                    description="Periksa kembali informasi pribadi Anda."
                />
                <div className="registration-confirm-grid">
                    <ConfirmItem
                        label="Nama Lengkap"
                        value={formData.full_name}
                        icon="bi-person"
                    />
                    <ConfirmItem
                        label="NIK"
                        value={formData.nik}
                        icon="bi-person-vcard"
                    />
                    <ConfirmItem
                        label="Jenis Kelamin"
                        value={
                            formData.gender === "L"
                                ? "Laki-laki"
                                : formData.gender === "P"
                                    ? "Perempuan"
                                    : "-"
                        }
                        icon="bi-people"
                    />
                    <ConfirmItem
                        label="Tempat, Tanggal Lahir"
                        value={`${
                            formData.birth_place || "-"
                        }, ${
                            formData.birth_date || "-"
                        }`}
                        icon="bi-calendar-event"
                    />
                    <ConfirmItem
                        label="Email"
                        value={formData.email}
                        icon="bi-envelope"
                    />
                    <ConfirmItem
                        label="Nomor Handphone"
                        value={formData.phone}
                        icon="bi-phone"
                    />
                </div>
            </section>
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-mortarboard"
                    title="Pendidikan & Aktivitas"
                    description="Ringkasan latar belakang pendidikan Anda."
                />
                <div className="registration-confirm-grid">
                    <ConfirmItem
                        label="Pendidikan Terakhir"
                        value={getDisplayLabel(
                            "last_education",
                            formData.last_education
                        )}
                        icon="bi-mortarboard"
                    />
                    <ConfirmItem
                        label="Jurusan"
                        value={formData.major}
                        icon="bi-book"
                    />
                    <ConfirmItem
                        label="Institusi Pendidikan"
                        value={formData.education_institution}
                        icon="bi-building"
                    />
                    <ConfirmItem
                        label="Aktivitas Saat Ini"
                        value={getDisplayLabel(
                            "current_activity",
                            formData.current_activity
                        )}
                        icon="bi-briefcase"
                    />
                    <ConfirmItem
                        label="Status Pernikahan"
                        value={getDisplayLabel(
                            "marital_status",
                            formData.marital_status
                        )}
                        icon="bi-person-hearts"
                    />
                    <ConfirmItem
                        label="Hubungan Orang Tua/Wali"
                        value={getDisplayLabel(
                            "parent_relationship",
                            formData.parent_relationship
                        )}
                        icon="bi-people"
                    />
                    <ConfirmItem
                        label="Nomor HP Orang Tua/Wali"
                        value={formData.parent_phone}
                        icon="bi-telephone"
                    />
                </div>
            </section>
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-geo-alt"
                    title="Alamat"
                    description="Pastikan informasi tempat tinggal sudah sesuai."
                />
                <div className="registration-address-review-grid">
                    <div className="registration-address-review-card">
                        <div className="registration-address-review-header">
                            <div className="registration-address-review-icon">
                                <i className="bi bi-person-vcard"></i>
                            </div>
                            <div className="registration-address-review-title">
                                <small>
                                    ALAMAT IDENTITAS
                                </small>
                                <strong>
                                    Alamat Sesuai KTP
                                </strong>
                            </div>
                        </div>
                        <div className="registration-address-review-body">
                            <p>
                                {formData.ktp_address || "-"}
                            </p>
                            <div className="registration-address-review-location">
                                <i className="bi bi-geo-alt"></i>
                                <span>
                                    {formData.ktp_city_name &&
                                    formData.ktp_province_name
                                        ? `${formData.ktp_city_name}, ${formData.ktp_province_name}`
                                        : "-"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="registration-address-review-card">
                        <div className="registration-address-review-header">
                            <div className="registration-address-review-icon domicile">
                                <i className="bi bi-house-door"></i>
                            </div>
                            <div className="registration-address-review-title">
                                <small>
                                    TEMPAT TINGGAL
                                </small>
                                <strong>
                                    Alamat Domisili
                                </strong>
                            </div>
                        </div>
                        <div className="registration-address-review-body">
                            <p>
                                {formData.domicile_address || "-"}
                            </p>
                            <div className="registration-address-review-location">
                                <i className="bi bi-geo-alt"></i>
                                <span>
                                    {formData.domicile_city_name &&
                                    formData.domicile_province_name
                                        ? `${formData.domicile_city_name}, ${formData.domicile_province_name}`
                                        : "-"}
                                </span>
                            </div>
                            {isSameAsKTP && (
                                <div className="registration-address-same-badge">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <span>
                                        Sama dengan KTP
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-briefcase"
                    title="Program yang Dipilih"
                    description="Ringkasan program pilihan Anda."
                />
                <div className="registration-program-review-card">
                    <div className="registration-program-review-header">
                        <div className="registration-program-review-icon">
                            <i className="bi bi-briefcase"></i>
                        </div>
                        <div className="registration-program-review-title">
                            <small>
                                PROGRAM FITALENTA
                            </small>
                            <strong>
                                {selectedProgram?.name || "-"}
                            </strong>
                        </div>
                    </div>
                    <div className="registration-program-review-meta">
                        <div className="registration-program-review-item">
                            <div className="registration-program-meta-icon">
                                <i className="bi bi-clock"></i>
                            </div>
                            <div>
                                <small>
                                    Durasi
                                </small>
                                <strong>
                                    {selectedProgram?.duration || "-"}
                                </strong>
                            </div>
                        </div>
                        <div className="registration-program-review-item">
                            <div className="registration-program-meta-icon">
                                <i className="bi bi-wallet2"></i>
                            </div>
                            <div>
                                <small>
                                    Biaya Pelatihan
                                </small>
                                <strong>
                                    {selectedProgram
                                        ? helpers.formatCurrency(
                                            selectedProgram.training_cost ||
                                            0
                                        )
                                        : "-"}
                                </strong>
                            </div>
                        </div>
                        {isHybrid && (
                            <div className="registration-program-review-item">
                                <div className="registration-program-meta-icon">
                                    <i className="bi bi-person-workspace"></i>
                                </div>
                                <div>
                                    <small>
                                        Pendampingan Job Matching
                                    </small>
                                    <strong>
                                        {helpers.formatCurrency(
                                            selectedProgram?.job_matching_cost ||
                                            0
                                        )}
                                    </strong>
                                </div>
                            </div>
                        )}
                        <div className="registration-program-review-item">
                            <div className="registration-program-meta-icon">
                                <i className="bi bi-airplane"></i>
                            </div>
                            <div>
                                <small>
                                    Biaya Keberangkatan
                                </small>
                                <strong>
                                    {selectedProgram
                                        ? helpers.formatCurrency(
                                            selectedProgram.departure_cost ||
                                            0
                                        )
                                        : "-"}
                                </strong>
                            </div>
                        </div>
                        <div className="registration-program-review-item">
                            <div className="registration-program-meta-icon">
                                <i className="bi bi-cash-stack"></i>
                            </div>
                            <div>
                                <small>
                                    DP / Uang Muka
                                </small>
                                <strong>
                                    {getDownPaymentLabel(
                                        selectedProgram
                                    )}
                                </strong>
                            </div>
                        </div>
                        <div className="registration-program-review-item">
                            <div className="registration-program-meta-icon">
                                <i className="bi bi-arrow-repeat"></i>
                            </div>
                            <div>
                                <small>
                                    Skema Pembayaran
                                </small>
                                <strong>
                                    {getInstallmentLabel(
                                        selectedProgram
                                    )}
                                </strong>
                            </div>
                        </div>
                        <div className="registration-program-review-item">
                            <div className="registration-program-meta-icon">
                                <i className="bi bi-calendar3"></i>
                            </div>
                            <div>
                                <small>
                                    Jadwal
                                </small>
                                <strong>
                                    {selectedProgram?.schedule || "-"}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {isFastTrack && (
                <section className="registration-form-section">
                    <SectionHeading
                        icon="bi-file-earmark-check"
                        title="Dokumen Fast Track"
                        description="Dokumen yang akan dikirim bersama pendaftaran."
                    />
                    <div className="registration-confirm-grid">
                        <ConfirmItem
                            label="Sertifikat N4"
                            value={
                                formData.n4_file?.name ||
                                "Belum diupload"
                            }
                            icon="bi-file-earmark-check"
                        />
                        <ConfirmItem
                            label="Sertifikat SSW"
                            value={
                                formData.ssw_file?.name ||
                                "Belum diupload"
                            }
                            icon="bi-file-earmark-check"
                        />
                    </div>
                </section>
            )}
            <section className="registration-form-section">
                <SectionHeading
                    icon="bi-shield-check"
                    title="Konfirmasi & Persetujuan"
                    description="Satu langkah terakhir sebelum pendaftaran dikirim."
                />
                <label
                    className={`registration-agreement ${
                        agreement
                            ? "checked"
                            : ""
                    }`}
                    htmlFor="agreement"
                >
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="agreement"
                        checked={agreement}
                        onChange={(e) =>
                            setAgreement(
                                e.target.checked
                            )
                        }
                    />
                    <div className="registration-agreement-icon">
                        <i className="bi bi-shield-check"></i>
                    </div>
                    <div className="registration-agreement-content">
                        <strong>
                            Saya memastikan data yang saya berikan benar
                        </strong>
                        <span>
                            Saya menyatakan seluruh data yang tercantum di atas
                            adalah benar dan valid serta telah membaca,
                            memahami, dan menyetujui Syarat dan Ketentuan
                            Program FITALENTA.
                            <span className="text-danger">
                                {" "}*
                            </span>
                        </span>
                    </div>
                    <div className="registration-agreement-check">
                        <i className="bi bi-check-lg"></i>
                    </div>
                </label>
                <div className="registration-warning-box">
                    <div className="registration-warning-icon">
                        <i className="bi bi-exclamation-triangle"></i>
                    </div>
                    <div>
                        <strong>
                            Periksa sekali lagi sebelum mengirim
                        </strong>
                        <span>
                            Data yang telah dikirim tidak dapat diubah.
                            Setelah formulir terkirim, Anda akan masuk
                            ke proses seleksi interview.
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );

    /* =========================================================
       HELP REGISTRATION
    ========================================================= */
    const FloatingHelp = () => (
        <div className="registration-floating-help">
            <button
                type="button"
                onClick={() =>
                    setShowHelp(
                        (prev) => !prev
                    )
                }
                aria-label="Bantuan pendaftaran"
            >
                <i className="bi bi-question-lg"></i>
            </button>
            {showHelp && (
                <div className="registration-help-popup">
                    <strong>
                        Mengalami kendala?
                    </strong>
                    <span>
                        Tim FITALENTA siap membantu proses pendaftaran Anda.
                    </span>
                    <a
                        href="https://wa.me/6281110119273"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Hubungi Tim FITALENTA
                    </a>
                </div>
            )}
        </div>
    );

    /* =========================================================
       SUCCESS MODAL
    ========================================================= */
    const SuccessModal = () => (
        <div
            className={`modal fade ${
                showSuccessModal
                    ? "show"
                    : ""
            }`}
            style={{
                display:
                    showSuccessModal
                        ? "block"
                        : "none",
            }}
            tabIndex="-1"
            role="dialog"
            aria-modal={
                showSuccessModal
                    ? "true"
                    : undefined
            }
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content registration-success-modal">
                    <div className="registration-success-illustration">
                        <div className="registration-success-circle">
                            <i className="bi bi-check-lg"></i>
                        </div>
                    </div>
                    <div className="modal-body text-center">
                        <span className="registration-success-label">
                            PENDAFTARAN BERHASIL
                        </span>
                        <h4>
                            Selamat, pendaftaran Anda telah diterima!
                        </h4>
                        <p>
                            Anda telah berhasil mendaftar pada program{" "}
                            <strong>
                                {selectedProgram?.name}
                            </strong>
                            .
                        </p>
                        <div className="registration-code-card">
                            <small>
                                NOMOR PENDAFTARAN
                            </small>
                            <strong>
                                #
                                {
                                    registrationResult
                                        ?.registration_code
                                }
                            </strong>
                            <span>
                                Simpan nomor ini untuk kebutuhan selanjutnya.
                            </span>
                        </div>
                        <div className="registration-next-step">
                            <i className="bi bi-whatsapp"></i>
                            <div>
                                <strong>
                                    Pantau WhatsApp Anda
                                </strong>
                                <span>
                                    Informasi proses seleksi berikutnya akan
                                    disampaikan melalui nomor yang Anda
                                    daftarkan.
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                        >
                            <span>
                                Lihat Detail Program
                            </span>
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    /* =========================================================
       AUTO SAVE STATUS
    ========================================================= */
    const DraftStatus = () => {
        if (
            !draftLoaded ||
            draftStatus === "idle"
        ) {
            return null;
        }
        if (draftStatus === "saving") {
            return (
                <div className="d-flex align-items-center justify-content-center gap-2 text-muted small mb-3">
                    <i className="bi bi-cloud-arrow-up"></i>
                    <span>
                        Menyimpan perubahan...
                    </span>
                </div>
            );
        }
        if (draftStatus === "restored") {
            return (
                <div className="d-flex align-items-center justify-content-center gap-2 text-success small mb-3">
                    <i className="bi bi-cloud-check"></i>
                    <span>
                        Data sebelumnya dipulihkan dan tersimpan otomatis
                    </span>
                </div>
            );
        }
        if (draftStatus === "error") {
            return (
                <div className="d-flex align-items-center justify-content-center gap-2 text-danger small mb-3">
                    <i className="bi bi-cloud-slash"></i>
                    <span>
                        Penyimpanan otomatis tidak tersedia
                    </span>
                </div>
            );
        }
        return (
            <div className="d-flex align-items-center justify-content-center gap-2 text-muted small mb-3">
                <i className="bi bi-cloud-check"></i>
                <span>
                    Tersimpan otomatis
                </span>
            </div>
        );
    };

    /* =========================================================
       REGISTRATION TUTORIAL
    ========================================================= */
    const tutorialPreparation = [
        {
            icon: "bi-person-vcard",
            title: "KTP / NIK",
            description:
                "Siapkan 16 digit NIK dan informasi alamat sesuai identitas resmi.",
        },
        {
            icon: "bi-camera",
            title: "Foto Terbaru",
            description:
                "Gunakan foto terbaru dalam format JPG atau PNG, maksimal 10 MB.",
        },
        {
            icon: "bi-whatsapp",
            title: "WhatsApp Aktif",
            description:
                "Pastikan nomor WhatsApp aktif dan dapat dihubungi oleh tim FITALENTA.",
        },
        {
            icon: "bi-mortarboard",
            title: "Data Pendidikan",
            description:
                "Siapkan pendidikan terakhir, jurusan, dan institusi pendidikan.",
        },
        {
            icon: "bi-geo-alt",
            title: "Alamat Domisili",
            description:
                "Siapkan alamat tempat tinggal Anda saat ini.",
        },
        {
            icon: "bi-file-earmark-check",
            title: "Dokumen Fast Track",
            description:
                "Siapkan Sertifikat N4 dan SSW apabila memilih Program Fast Track.",
        },
    ];
    const tutorialSteps = [
        {
            step: 1,
            icon: "bi-person-vcard",
            eyebrow: "LANGKAH PERTAMA",
            title: "Lengkapi Data Diri",
            description:
                "Isi seluruh identitas pribadi dan informasi pendukung secara lengkap sesuai dokumen resmi.",
            checklist: [
                "Upload foto terbaru dalam format JPG atau PNG.",
                "Isi nama lengkap dan 16 digit NIK sesuai KTP.",
                "Lengkapi jenis kelamin, tempat lahir, dan tanggal lahir.",
                "Pastikan nomor WhatsApp yang digunakan masih aktif.",
                "Lengkapi pendidikan terakhir, jurusan, dan institusi pendidikan.",
                "Pilih aktivitas saat ini dan status pernikahan.",
                "Isi hubungan serta nomor handphone orang tua atau wali.",
                "Lengkapi alamat sesuai KTP.",
                "Lengkapi alamat domisili atau gunakan pilihan Sama dengan KTP.",
            ],
            result:
                "Data profil peserta lengkap dan siap digunakan.",
        },
        {
            step: 2,
            icon: "bi-briefcase",
            eyebrow: "LANGKAH KEDUA",
            title: "Pilih Program",
            description:
                "Pelajari program yang tersedia dan pilih jalur yang paling sesuai dengan kebutuhan serta kesiapan Anda.",
            checklist: [
                "Lihat tujuh pilihan program yang tersedia.",
                "Baca deskripsi dan informasi masing-masing program.",
                "Perhatikan durasi pelaksanaan program.",
                "Periksa jadwal program sebelum menentukan pilihan.",
                "Perhatikan biaya pelatihan dan biaya keberangkatan.",
                "Perhatikan DP dan skema cicilan apabila tersedia.",
                "Program Hybrid memiliki biaya pendampingan Job Matching.",
                "Klik kartu program untuk memilih program.",
                "Pastikan bagian Program Terpilih menampilkan program yang benar.",
            ],
            result:
                "Program FITALENTA berhasil dipilih.",
        },
        {
            step: 3,
            icon: "bi-check2-circle",
            eyebrow: "LANGKAH TERAKHIR",
            title: "Periksa & Kirim",
            description:
                "Lakukan pemeriksaan terakhir sebelum mengirim pendaftaran ke FITALENTA.",
            checklist: [
                "Periksa kembali identitas dan data pribadi.",
                "Pastikan data pendidikan dan aktivitas sudah benar.",
                "Periksa kembali kontak orang tua atau wali.",
                "Pastikan alamat KTP dan domisili sudah sesuai.",
                "Periksa program yang telah dipilih.",
                "Periksa rincian biaya dan skema pembayaran program.",
                "Periksa dokumen Fast Track apabila diperlukan.",
                "Baca pernyataan konfirmasi dan persetujuan.",
                "Centang persetujuan sebelum mengirim.",
                "Klik tombol Kirim Pendaftaran.",
            ],
            result:
                "Pendaftaran dikirim dan masuk ke proses seleksi.",
        },
    ];
    const tutorialPageNames = [
        "Persiapan",
        "Data Diri",
        "Pilih Program",
        "Periksa & Kirim",
        "Tahap Selanjutnya",
    ];
    const tutorialTotalPages =
        tutorialPageNames.length;
    const handleTutorialPrevious = () => {
        setTutorialPage((prev) =>
            Math.max(0, prev - 1)
        );
    };
    const handleTutorialNext = () => {
        setTutorialPage((prev) =>
            Math.min(
                tutorialTotalPages - 1,
                prev + 1
            )
        );
    };
    const handleTutorialContinue = () => {
        setShowTutorial(false);
        setTutorialPage(0);
        window.requestAnimationFrame(() => {
            document
                .getElementById(
                    "registration-form-area"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        });
    };
    const TutorialStepPage = ({ data }) => (
        <div className="registration-guide-page">
            <div className="registration-guide-page-heading">
                <div className="registration-guide-page-heading-icon">
                    <i className={`bi ${data.icon}`}></i>
                </div>
                <div>
                    <span>
                        {data.eyebrow}
                    </span>
                    <h4>
                        {data.title}
                    </h4>
                    <p>
                        {data.description}
                    </p>
                </div>
            </div>
            <div className="registration-guide-detail-layout">
                <div className="registration-guide-checklist">
                    <span className="registration-guide-section-label">
                        YANG PERLU ANDA LAKUKAN
                    </span>
                    {data.checklist.map(
                        (item, index) => (
                            <div
                                className="registration-guide-check-item"
                                key={`${data.step}-${index}`}
                            >
                                <div>
                                    <i className="bi bi-check2"></i>
                                </div>
                                <span>
                                    {item}
                                </span>
                            </div>
                        )
                    )}
                </div>
                <div className="registration-guide-side">
                    {data.step === 1 && (
                        <div className="registration-guide-side-card">
                            <div className="registration-guide-side-icon">
                                <i className="bi bi-person-vcard"></i>
                            </div>
                            <strong>
                                Informasi yang akan diisi
                            </strong>
                            <span>
                                Identitas pribadi, pendidikan,
                                aktivitas, kontak orang tua atau wali,
                                alamat KTP, alamat domisili, dan foto.
                            </span>
                        </div>
                    )}
                    {data.step === 2 && (
                        <>
                            <div className="registration-guide-side-card">
                                <div className="registration-guide-side-icon">
                                    <i className="bi bi-search"></i>
                                </div>
                                <strong>
                                    Bandingkan sebelum memilih
                                </strong>
                                <span>
                                    Perhatikan durasi, jadwal, biaya pelatihan,
                                    biaya keberangkatan, DP, cicilan dan
                                    persyaratan sebelum menentukan program.
                                </span>
                            </div>
                            <div className="registration-guide-fasttrack">
                                <div className="registration-guide-fasttrack-icon">
                                    <i className="bi bi-lightning-charge-fill"></i>
                                </div>
                                <div>
                                    <strong>
                                        Khusus Program Fast Track
                                    </strong>
                                    <span>
                                        Sertifikat N4 dan SSW wajib
                                        diunggah jika Anda memilih
                                        Program Fast Track.
                                    </span>
                                    <small>
                                        JPG, PNG atau PDF • Maksimal
                                        10 MB per file
                                    </small>
                                </div>
                            </div>
                        </>
                    )}
                    {data.step === 3 && (
                        <div className="registration-guide-warning">
                            <div className="registration-guide-warning-icon">
                                <i className="bi bi-exclamation-triangle"></i>
                            </div>
                            <div>
                                <strong>
                                    Periksa sebelum mengirim
                                </strong>
                                <span>
                                    Pastikan seluruh informasi benar
                                    sebelum menekan tombol Kirim
                                    Pendaftaran.
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="registration-guide-result">
                        <small>
                            HASIL LANGKAH {data.step}
                        </small>
                        <div>
                            <i className="bi bi-check-circle"></i>
                            <strong>
                                {data.result}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    const renderTutorialPage = () => {
        if (tutorialPage === 0) {
            return (
                <div className="registration-guide-page">
                    <div className="registration-guide-page-heading">
                        <div className="registration-guide-page-heading-icon">
                            <i className="bi bi-clipboard-check"></i>
                        </div>
                        <div>
                            <span>
                                SEBELUM MEMULAI
                            </span>
                            <h4>
                                Siapkan Data & Dokumen
                            </h4>
                            <p>
                                Menyiapkan informasi berikut sebelum
                                mulai akan membuat proses pendaftaran
                                lebih cepat dan mengurangi kesalahan
                                saat mengisi.
                            </p>
                        </div>
                    </div>
                    <div className="registration-guide-preparation-grid">
                        {tutorialPreparation.map(
                            (item) => (
                                <div
                                    className="registration-guide-preparation-item"
                                    key={item.title}
                                >
                                    <div className="registration-guide-preparation-icon">
                                        <i
                                            className={`bi ${item.icon}`}
                                        ></i>
                                    </div>
                                    <div>
                                        <strong>
                                            {item.title}
                                        </strong>
                                        <span>
                                            {item.description}
                                        </span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                    <div className="registration-guide-tip">
                        <div className="registration-guide-tip-icon">
                            <i className="bi bi-lightbulb"></i>
                        </div>
                        <div>
                            <strong>
                                Gunakan data sesuai dokumen resmi
                            </strong>
                            <span>
                                Data yang konsisten dengan dokumen
                                resmi membantu memperlancar proses
                                verifikasi.
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        if (tutorialPage === 1) {
            return (
                <TutorialStepPage
                    data={tutorialSteps[0]}
                />
            );
        }
        if (tutorialPage === 2) {
            return (
                <TutorialStepPage
                    data={tutorialSteps[1]}
                />
            );
        }
        if (tutorialPage === 3) {
            return (
                <TutorialStepPage
                    data={tutorialSteps[2]}
                />
            );
        }
        return (
            <div className="registration-guide-page">
                <div className="registration-guide-page-heading">
                    <div className="registration-guide-page-heading-icon success">
                        <i className="bi bi-send-check"></i>
                    </div>
                    <div>
                        <span>
                            SETELAH PENDAFTARAN DIKIRIM
                        </span>
                        <h4>
                            Apa yang Terjadi Selanjutnya?
                        </h4>
                        <p>
                            Setelah formulir berhasil dikirim,
                            pendaftaran Anda akan masuk ke proses
                            seleksi FITALENTA.
                        </p>
                    </div>
                </div>
                <div className="registration-guide-after-flow">
                    <div className="registration-guide-after-item">
                        <div className="registration-guide-after-number">
                            1
                        </div>
                        <div>
                            <strong>
                                Form Berhasil Dikirim
                            </strong>
                            <span>
                                Sistem menampilkan nomor pendaftaran
                                setelah proses pengiriman berhasil.
                            </span>
                        </div>
                    </div>
                    <div className="registration-guide-after-arrow">
                        <i className="bi bi-arrow-right"></i>
                    </div>
                    <div className="registration-guide-after-item">
                        <div className="registration-guide-after-number">
                            2
                        </div>
                        <div>
                            <strong>
                                Masuk Proses Seleksi
                            </strong>
                            <span>
                                Tim FITALENTA akan memproses
                                pendaftaran dan melakukan pemeriksaan
                                data Anda.
                            </span>
                        </div>
                    </div>
                    <div className="registration-guide-after-arrow">
                        <i className="bi bi-arrow-right"></i>
                    </div>
                    <div className="registration-guide-after-item">
                        <div className="registration-guide-after-number">
                            3
                        </div>
                        <div>
                            <strong>
                                Informasi Lanjutan
                            </strong>
                            <span>
                                Pantau dashboard dan nomor WhatsApp
                                yang Anda gunakan saat mendaftar.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="registration-guide-after-info">
                    <div>
                        <i className="bi bi-bookmark-check"></i>
                    </div>
                    <span>
                        <strong>
                            Simpan nomor pendaftaran Anda
                        </strong>
                        <small>
                            Nomor pendaftaran dapat digunakan
                            sebagai referensi selama proses
                            selanjutnya.
                        </small>
                    </span>
                </div>
                <div className="registration-guide-ready">
                    <div className="registration-guide-ready-icon">
                        <i className="bi bi-check2-circle"></i>
                    </div>
                    <div>
                        <small>
                            PANDUAN SELESAI
                        </small>
                        <strong>
                            Anda siap melakukan pendaftaran
                        </strong>
                        <span>
                            Klik tombol Mulai Isi Formulir untuk
                            melanjutkan.
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    /* =========================================================
       MAIN RENDER
    ========================================================= */
    return (
        <div className="program-registration-page">
            <div className="registration-shell">
                <header className="registration-header">
                    <span className="registration-header-badge">
                        FITALENTA PROGRAM
                    </span>
                    <h2>
                        Mulai Perjalanan Karier Anda
                    </h2>
                    <p>
                        Lengkapi beberapa informasi berikut untuk mendaftar
                        program FITALENTA. Prosesnya hanya terdiri dari
                        tiga langkah.
                    </p>
                    <div className="registration-header-benefits">
                        <span>
                            <i className="bi bi-shield-check"></i>
                            Data aman
                        </span>
                        <span>
                            <i className="bi bi-clock"></i>
                            ± 5–10 menit
                        </span>
                        <span>
                            <i className="bi bi-check-circle"></i>
                            3 langkah
                        </span>
                    </div>
                </header>
                <div className="registration-stepper">
                    {[1, 2, 3].map(
                        (step) => {
                            const stepData = {
                                1: {
                                    title: "Data Diri",
                                    subtitle: "Kenali Anda",
                                    icon: "bi-person",
                                },
                                2: {
                                    title: "Program",
                                    subtitle: "Pilih jalur",
                                    icon: "bi-briefcase",
                                },
                                3: {
                                    title: "Konfirmasi",
                                    subtitle: "Periksa data",
                                    icon: "bi-check2-circle",
                                },
                            };
                            return (
                                <React.Fragment
                                    key={step}
                                >
                                    <div
                                        className={`registration-step-item ${
                                            step === currentStep
                                                ? "active"
                                                : ""
                                        } ${
                                            step < currentStep
                                                ? "completed"
                                                : ""
                                        }`}
                                    >
                                        <div className="registration-step-circle">
                                            {step < currentStep ? (
                                                <i className="bi bi-check-lg"></i>
                                            ) : (
                                                <i
                                                    className={`bi ${
                                                        stepData[
                                                            step
                                                            ].icon
                                                    }`}
                                                ></i>
                                            )}
                                        </div>
                                        <div className="registration-step-label">
                                            <small>
                                                LANGKAH {step}
                                            </small>
                                            <strong>
                                                {
                                                    stepData[
                                                        step
                                                        ].title
                                                }
                                            </strong>
                                            <span>
                                                {
                                                    stepData[
                                                        step
                                                        ].subtitle
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    {step < 3 && (
                                        <div
                                            className={`registration-step-line ${
                                                currentStep > step
                                                    ? "completed"
                                                    : ""
                                            }`}
                                        >
                                            <span></span>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        }
                    )}
                </div>
                <div className="registration-mobile-progress">
                    <div>
                        <span>
                            Langkah {currentStep} dari 3
                        </span>
                        <strong>
                            {currentStep === 1 &&
                                "Lengkapi data diri"}
                            {currentStep === 2 &&
                                "Pilih program"}
                            {currentStep === 3 &&
                                "Konfirmasi pendaftaran"}
                        </strong>
                    </div>
                    <span>
                        {Math.round(
                            (currentStep / 3) *
                            100
                        )}
                        %
                    </span>
                    <div className="registration-mobile-progress-bar">
                        <span
                            style={{
                                width: `${
                                    (currentStep /
                                        3) *
                                    100
                                }%`,
                            }}
                        ></span>
                    </div>
                </div>
                {error && (
                    <div className="registration-message registration-message-danger">
                        <div className="registration-message-icon">
                            <i className="bi bi-exclamation-circle"></i>
                        </div>
                        <div>
                            <strong>
                                Beberapa data masih perlu dilengkapi
                            </strong>
                            <span>
                                {error}
                            </span>
                        </div>
                    </div>
                )}
                {success && (
                    <div className="registration-message registration-message-success">
                        <div className="registration-message-icon">
                            <i className="bi bi-check-circle"></i>
                        </div>
                        <div>
                            <strong>
                                Berhasil
                            </strong>
                            <span>
                                {success}
                            </span>
                        </div>
                    </div>
                )}
                <DraftStatus />

                {/* =========================================================
                   TUTORIAL REGISTRASI
                ========================================================= */}
                <section className="registration-guide">
                    <div className="registration-guide-header">
                        <div className="registration-guide-heading">
                            <div className="registration-guide-heading-icon">
                                <i className="bi bi-compass"></i>
                            </div>
                            <div>
                                <span className="registration-guide-eyebrow">
                                    PANDUAN PENDAFTARAN
                                </span>
                                <h3>
                                    Cara Mendaftar Program FITALENTA
                                </h3>
                                <p>
                                    Ikuti panduan singkat berikut sebelum
                                    mengisi formulir pendaftaran.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="registration-guide-toggle"
                            onClick={() =>
                                setShowTutorial(
                                    (prev) => !prev
                                )
                            }
                            aria-expanded={showTutorial}
                        >
                            <span>
                                {showTutorial
                                    ? "Sembunyikan"
                                    : "Lihat Panduan"}
                            </span>
                            <i
                                className={`bi ${
                                    showTutorial
                                        ? "bi-chevron-up"
                                        : "bi-chevron-down"
                                }`}
                            ></i>
                        </button>
                    </div>
                    {showTutorial && (
                        <div className="registration-guide-body">
                            <div className="registration-guide-progress">
                                <div className="registration-guide-progress-top">
                                    <div>
                                        <span>
                                            PANDUAN{" "}
                                            {tutorialPage + 1} DARI{" "}
                                            {tutorialTotalPages}
                                        </span>
                                        <strong>
                                            {
                                                tutorialPageNames[
                                                    tutorialPage
                                                    ]
                                            }
                                        </strong>
                                    </div>
                                    <span className="registration-guide-progress-percent">
                                        {Math.round(
                                            ((tutorialPage + 1) /
                                                tutorialTotalPages) *
                                            100
                                        )}
                                        %
                                    </span>
                                </div>
                                <div className="registration-guide-progress-track">
                                    <span
                                        style={{
                                            width: `${
                                                ((tutorialPage + 1) /
                                                    tutorialTotalPages) *
                                                100
                                            }%`,
                                        }}
                                    ></span>
                                </div>
                                <div className="registration-guide-progress-steps">
                                    {tutorialPageNames.map(
                                        (name, index) => (
                                            <div
                                                key={name}
                                                className={`registration-guide-progress-step ${
                                                    index === tutorialPage
                                                        ? "active"
                                                        : ""
                                                } ${
                                                    index < tutorialPage
                                                        ? "completed"
                                                        : ""
                                                }`}
                                            >
                                                <div>
                                                    {index < tutorialPage ? (
                                                        <i className="bi bi-check-lg"></i>
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </div>
                                                <span>
                                                    {name}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div
                                className="registration-guide-content"
                                aria-live="polite"
                            >
                                {renderTutorialPage()}
                            </div>
                            <div className="registration-guide-navigation">
                                <button
                                    type="button"
                                    className="registration-guide-nav previous"
                                    onClick={
                                        handleTutorialPrevious
                                    }
                                    disabled={
                                        tutorialPage === 0
                                    }
                                >
                                    <i className="bi bi-arrow-left"></i>
                                    <span>
                                        Sebelumnya
                                    </span>
                                </button>
                                <div className="registration-guide-navigation-status">
                                    <span>
                                        {tutorialPage + 1} /{" "}
                                        {tutorialTotalPages}
                                    </span>
                                    <small>
                                        {
                                            tutorialPageNames[
                                                tutorialPage
                                                ]
                                        }
                                    </small>
                                </div>
                                {tutorialPage <
                                tutorialTotalPages - 1 ? (
                                    <button
                                        type="button"
                                        className="registration-guide-nav next"
                                        onClick={
                                            handleTutorialNext
                                        }
                                    >
                                        <span>
                                            Selanjutnya
                                        </span>
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="registration-guide-nav start"
                                        onClick={
                                            handleTutorialContinue
                                        }
                                    >
                                        <span>
                                            Mulai Isi Formulir
                                        </span>
                                        <i className="bi bi-arrow-down"></i>
                                    </button>
                                )}
                            </div>
                            <div className="registration-guide-autosave">
                                <div className="registration-guide-autosave-icon">
                                    <i className="bi bi-cloud-check"></i>
                                </div>
                                <div>
                                    <strong>
                                        Form tersimpan otomatis
                                    </strong>
                                    <span>
                                        Data yang Anda isi akan
                                        disimpan otomatis di browser.
                                        Foto dan dokumen perlu dipilih
                                        kembali apabila halaman dimuat
                                        ulang.
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* =========================================================
                   REGISTRATION FORM
                ========================================================= */}
                <form
                    id="registration-form-area"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="registration-main-card">
                        <div className="registration-main-body">
                            {currentStep === 1 &&
                                renderStep1()}
                            {currentStep === 2 &&
                                renderStep2()}
                            {currentStep === 3 &&
                                renderStep3()}
                        </div>
                        <div className="registration-navigation">
                            <button
                                type="button"
                                className="registration-nav-btn previous"
                                onClick={prevStep}
                                disabled={
                                    currentStep === 1
                                }
                            >
                                <i className="bi bi-arrow-left"></i>
                                <span>
                                    Sebelumnya
                                </span>
                            </button>
                            <div className="registration-navigation-status">
                                <span>
                                    {currentStep === 1 &&
                                        "Data diri"}
                                    {currentStep === 2 &&
                                        "Program & dokumen"}
                                    {currentStep === 3 &&
                                        "Konfirmasi"}
                                </span>
                                <small>
                                    Langkah {currentStep} dari 3
                                </small>
                            </div>
                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    className="registration-nav-btn next"
                                    onClick={nextStep}
                                >
                                    <span>
                                        Lanjutkan
                                    </span>
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="registration-nav-btn submit"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                            ></span>
                                            <span>
                                                Mengirim...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send-check"></i>
                                            <span>
                                                Kirim Pendaftaran
                                            </span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
                <div className="registration-help-footer">
                    <i className="bi bi-question-circle"></i>
                    <span>
                        Mengalami kendala saat mengisi formulir?
                    </span>
                    <a
                        href="https://wa.me/6281110119273"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Hubungi tim FITALENTA
                    </a>
                </div>
                <FloatingHelp />
                <SuccessModal />
                {showSuccessModal && (
                    <div className="modal-backdrop fade show"></div>
                )}
            </div>
        </div>
    );
>>>>>>> perbaikan-website-fitalenta
};

export default ProgramRegistration;