// views/admin/quanlybanner/components/ImageUploadButton.jsx

import { useRef, useState } from "react";
import { Button, Icon, useColorModeValue } from "@chakra-ui/react";
import { MdCloudUpload, MdSchedule } from "react-icons/md";

export function ImageUploadButton({ onImageLoaded, onFileSelected }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const btnBg = useColorModeValue("#f8fafc", "#1a2744");
  const btnColor = useColorModeValue("#64748b", "#8899b4");
  const btnBorder = useColorModeValue("#e2e8f0", "#2a3a5c");

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { 
      alert("Vui lòng chọn file ảnh"); 
      return; 
    }
    if (file.size > 5 * 1024 * 1024) { 
      alert("Ảnh phải nhỏ hơn 5MB"); 
      return; 
    }
    setUploading(true);
    
    // Gọi callback với file
    if (onFileSelected) {
      onFileSelected(file);
    }
    
    const reader = new FileReader();
    reader.onload = (ev) => { 
      if (onImageLoaded) {
        onImageLoaded(ev.target.result); 
      }
      setUploading(false); 
    };
    reader.onerror = () => { 
      alert("Lỗi đọc file"); 
      setUploading(false); 
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <input 
        ref={fileRef} 
        type="file" 
        accept="image/*" 
        style={{ display: "none" }} 
        onChange={handleFile} 
      />
      <Button 
        w="100%" 
        h="36px" 
        mt="12px" 
        borderRadius="9px"
        bg={btnBg} 
        color={btnColor} 
        border={`1px solid ${btnBorder}`}
        fontSize="12px" 
        fontWeight="600"
        _hover={{ 
          bg: "#fff7ed", 
          color: "#f97316", 
          border: "1px solid #fed7aa" 
        }}
        transition="all 0.2s"
        leftIcon={<Icon as={uploading ? MdSchedule : MdCloudUpload} boxSize="13px" />}
        isLoading={uploading} 
        loadingText="Đang tải..."
        onClick={() => fileRef.current?.click()}
      >
        Tải lên từ máy tính
      </Button>
    </>
  );
}