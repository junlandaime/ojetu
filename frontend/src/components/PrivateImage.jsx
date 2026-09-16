import { useEffect, useState } from "react";
import {
  getPrivateFileUrl,
  revokePrivateFileUrl,
} from "../utils/privateFile";

const PrivateImage = ({ filePath, alt = "", fallback = null, ...props }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let active = true;
    let blobUrl = null;

    const loadImage = async () => {
      if (!filePath) {
        setSrc(null);
        return;
      }

      try {
        blobUrl = await getPrivateFileUrl(filePath);

        if (active) {
          setSrc(blobUrl);
        } else {
          revokePrivateFileUrl(blobUrl);
        }
      } catch (error) {
        console.error("Gagal memuat gambar private:", error);

        if (active) {
          setSrc(null);
        }
      }
    };

    loadImage();

    return () => {
      active = false;

      if (blobUrl) {
        revokePrivateFileUrl(blobUrl);
      }
    };
  }, [filePath]);

  if (!src) {
    return fallback;
  }

  return <img src={src} alt={alt} {...props} />;
};

export default PrivateImage;

