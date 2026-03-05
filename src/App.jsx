import React, { useState, useCallback } from 'react';
import { TextField, Box, Typography, Snackbar, Button, ToggleButtonGroup, ToggleButton, Tooltip, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { QRCodeSVG } from 'qrcode.react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const primaryColor = '#1e3a5f';
const secondaryColor = '#2d5a87';
const accentColor = '#4a90d9';
const bgColor = '#f5f7fa';
const cardBg = '#ffffff';
const textPrimary = '#1a1a2e';
const textSecondary = '#6b7280';

function App() {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [qrSize, setQrSize] = useState('medium');
  const [qrColor, setQrColor] = useState('#000000');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const [logo, setLogo] = useState(null);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // ครอปรูปให้เป็นสี่เหลี่ยมจัตุรัสตรงกลาง
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );
        setLogo(canvas.toDataURL('image/png'));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const handleGenerateClick = useCallback(() => {
    if (url.trim() !== '') {
      setQrCode(url);
      setSnackbarMessage('QR Code สร้างเรียบร้อยแล้ว');
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage('กรุณากรอก URL');
      setOpenSnackbar(true);
    }
  }, [url]);

  const handleCopyClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setSnackbarMessage('คัดลอก URL สำเร็จ');
    } catch {
      setSnackbarMessage('ไม่สามารถคัดลอกได้');
    }
    setOpenSnackbar(true);
  }, [url]);

  const handleDownload = useCallback(() => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = async () => {
      const scale = 4;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // ใช้ Web Share API เฉพาะ iOS Safari เพื่อบันทึกไปที่รูปภาพ
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS && navigator.share && navigator.canShare) {
        try {
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
          const file = new File([blob], 'qrcode.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file] });
            setSnackbarMessage('ดาวน์โหลด QR Code สำเร็จ');
            setOpenSnackbar(true);
            return;
          }
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      // Fallback สำหรับ browser อื่น
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      setSnackbarMessage('ดาวน์โหลด QR Code สำเร็จ');
      setOpenSnackbar(true);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, []);

  const handleSizeChange = useCallback((event, newSize) => {
    if (newSize !== null) {
      setQrSize(newSize);
    }
  }, []);

  const getQrSize = () => {
    switch (qrSize) {
      case 'small': return 120;
      case 'large': return 240;
      default: return 180;
    }
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      sx={{
        background: `linear-gradient(135deg, ${bgColor} 0%, #e8eef5 100%)`,
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: cardBg,
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <QrCode2Icon sx={{ color: '#fff', fontSize: 32 }} />
            <Typography
              variant="h5"
              sx={{
                color: '#fff',
                fontWeight: 600,
                fontFamily: "'Kanit', sans-serif",
                letterSpacing: '0.5px',
              }}
            >
              QR Code Generator
            </Typography>
          </Box>
      
        </Box>

        {/* Content */}
        <Box sx={{ padding: '24px' }}>
          <TextField
            fullWidth
            label="กรอก URL หรือข้อความ"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{
              marginBottom: '16px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontFamily: "'Kanit', sans-serif",
                backgroundColor: '#fafbfc',
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: accentColor,
                },
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                fontFamily: "'Kanit', sans-serif",
                color: textSecondary,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleGenerateClick}
            sx={{
              borderRadius: '8px',
              padding: '12px',
              backgroundColor: primaryColor,
              color: '#fff',
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 600,
              fontSize: '16px',
              textTransform: 'none',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(30, 58, 95, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: secondaryColor,
                boxShadow: '0 4px 12px rgba(30, 58, 95, 0.4)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            สร้าง QR Code
          </Button>

          {/* Size Options - แสดงเสมอ */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: textSecondary,
                fontFamily: "'Kanit', sans-serif",
                mb: 1,
                fontWeight: 500,
              }}
            >
              ขนาด QR Code
            </Typography>
            <ToggleButtonGroup
              value={qrSize}
              exclusive
              onChange={handleSizeChange}
              aria-label="QR code size"
              sx={{
                display: 'flex',
                width: '100%',
                '& .MuiToggleButton-root': {
                  flex: 1,
                  borderColor: '#d1d5db',
                  color: textSecondary,
                  fontFamily: "'Kanit', sans-serif",
                  fontWeight: 500,
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    backgroundColor: primaryColor,
                    color: '#fff',
                    borderColor: primaryColor,
                    '&:hover': {
                      backgroundColor: secondaryColor,
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                  },
                },
              }}
            >
              <ToggleButton value="small">เล็ก</ToggleButton>
              <ToggleButton value="medium">กลาง</ToggleButton>
              <ToggleButton value="large">ใหญ่</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Empty State */}
          {!qrCode && (
            <Box
              sx={{
                textAlign: 'center',
                py: 5,
                opacity: 0.5,
              }}
            >
              <QrCodeScannerIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 1.5 }} />
              <Typography
                sx={{
                  color: textSecondary,
                  fontFamily: "'Kanit', sans-serif",
                  fontSize: '14px',
                }}
              >
                พิมพ์ URL แล้วกดสร้าง QR Code
              </Typography>
            </Box>
          )}

          {/* QR Code Display + Options */}
          {qrCode && (
            <Box
              sx={{
                animation: 'fadeIn 0.3s ease',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(8px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              {/* QR Code */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <QRCodeSVG
                    id="qr-code"
                    value={qrCode}
                    size={getQrSize()}
                    level={logo ? 'H' : 'L'}
                    fgColor={qrColor}
                    imageSettings={logo ? {
                      src: logo,
                      height: Math.round(getQrSize() * 0.22),
                      width: Math.round(getQrSize() * 0.22),
                      excavate: false,
                    } : undefined}
                    marginSize={2}
                    style={{ display: 'block', transition: 'all 0.3s ease' }}
                  />
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCopyClick}
                  startIcon={<ContentCopyIcon />}
                  sx={{
                    borderRadius: '8px',
                    padding: '10px',
                    borderColor: '#d1d5db',
                    color: textSecondary,
                    fontFamily: "'Kanit', sans-serif",
                    fontWeight: 500,
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: primaryColor,
                      backgroundColor: '#f0f4f8',
                      color: primaryColor,
                    },
                  }}
                >
                  คัดลอก URL
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleDownload}
                  startIcon={<DownloadIcon />}
                  sx={{
                    borderRadius: '8px',
                    padding: '10px',
                    backgroundColor: primaryColor,
                    fontFamily: "'Kanit', sans-serif",
                    fontWeight: 500,
                    textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(30, 58, 95, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: secondaryColor,
                      boxShadow: '0 4px 12px rgba(30, 58, 95, 0.4)',
                    },
                  }}
                >
                  บันทึกรูป
                </Button>
              </Box>

              {/* Color Picker */}
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: textSecondary,
                    fontFamily: "'Kanit', sans-serif",
                    mb: 1.5,
                    fontWeight: 500,
                  }}
                >
                  สี QR Code
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  {[
                    { color: '#000000', name: 'ดำ' },
                    { color: '#1e3a5f', name: 'น้ำเงินเข้ม' },
                    { color: '#0066cc', name: 'น้ำเงิน' },
                    { color: '#059669', name: 'เขียว' },
                    { color: '#dc2626', name: 'แดง' },
                    { color: '#7c3aed', name: 'ม่วง' },
                    { color: '#ea580c', name: 'ส้ม' },
                    { color: '#0891b2', name: 'ฟ้า' },
                  ].map(({ color, name }) => (
                    <Tooltip key={color} title={name} arrow>
                      <Box
                        onClick={() => setQrColor(color)}
                        sx={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: color,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: qrColor === color ? '3px solid #4a90d9' : '2px solid #e5e7eb',
                          transition: 'all 0.2s ease',
                          boxShadow: qrColor === color ? '0 0 0 2px rgba(74, 144, 217, 0.3)' : 'none',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                  {/* Custom Color Picker */}
                  <Tooltip title="เลือกสีเอง" arrow>
                    <Box
                      onClick={() => {
                        setCustomColor(qrColor);
                        setColorPickerOpen(true);
                      }}
                      sx={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: '2px dashed #d1d5db',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#fafbfc',
                        '&:hover': {
                          borderColor: primaryColor,
                          backgroundColor: '#f0f4f8',
                        },
                      }}
                    >
                      <ColorLensIcon sx={{ fontSize: 18, color: textSecondary }} />
                    </Box>
                  </Tooltip>
                </Box>
              </Box>

              {/* Logo Upload */}
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: textSecondary,
                    fontFamily: "'Kanit', sans-serif",
                    mb: 1.5,
                    fontWeight: 500,
                  }}
                >
                  โลโก้ตรงกลาง
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddPhotoAlternateIcon />}
                    sx={{
                      flex: 1,
                      borderRadius: '8px',
                      fontFamily: "'Kanit', sans-serif",
                      textTransform: 'none',
                      borderColor: '#d1d5db',
                      color: textSecondary,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: primaryColor,
                        color: primaryColor,
                      },
                    }}
                  >
                    {logo ? 'เปลี่ยนรูป' : 'เลือกรูป'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleLogoUpload}
                    />
                  </Button>
                  {logo && (
                    <IconButton
                      onClick={() => setLogo(null)}
                      sx={{
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        color: '#dc2626',
                        '&:hover': {
                          backgroundColor: '#fef2f2',
                          borderColor: '#dc2626',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                {logo && (
                  <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="img"
                      src={logo}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '6px',
                        objectFit: 'cover',
                        border: '1px solid #e5e7eb',
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "'Kanit', sans-serif",
                        fontSize: '13px',
                        color: textSecondary,
                      }}
                    >
                      ใส่โลโก้แล้ว
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Color Picker Popup */}
      <Dialog
        open={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '24px',
            minWidth: '300px',
            textAlign: 'center',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography
            sx={{
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 600,
              fontSize: '18px',
              color: textPrimary,
            }}
          >
            เลือกสีเอง
          </Typography>
          <IconButton
            onClick={() => setColorPickerOpen(false)}
            size="small"
            sx={{
              color: textSecondary,
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Color Preview */}
        <Box
          sx={{
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            backgroundColor: customColor,
            margin: '0 auto',
            mb: 2.5,
            border: '2px solid #e5e7eb',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          }}
        />

        {/* Native Color Input (large) */}
        <Box sx={{ mb: 2.5 }}>
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            style={{
              width: '100%',
              height: '48px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              padding: 0,
              background: 'transparent',
            }}
          />
        </Box>

        {/* Hex Input */}
        <TextField
          fullWidth
          size="small"
          label="Hex Code"
          value={customColor}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
              setCustomColor(val);
            }
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '16px',
            },
            '& .MuiInputLabel-root': {
              fontFamily: "'Kanit', sans-serif",
            },
          }}
        />

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setColorPickerOpen(false)}
            sx={{
              borderRadius: '8px',
              fontFamily: "'Kanit', sans-serif",
              textTransform: 'none',
              borderColor: '#d1d5db',
              color: textSecondary,
              '&:hover': {
                borderColor: primaryColor,
                color: primaryColor,
              },
            }}
          >
            ยกเลิก
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              if (/^#[0-9A-Fa-f]{6}$/.test(customColor)) {
                setQrColor(customColor);
              }
              setColorPickerOpen(false);
            }}
            sx={{
              borderRadius: '8px',
              fontFamily: "'Kanit', sans-serif",
              textTransform: 'none',
              backgroundColor: primaryColor,
              '&:hover': {
                backgroundColor: secondaryColor,
              },
            }}
          >
            ใช้สีนี้
          </Button>
        </Box>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        ContentProps={{
          sx: {
            backgroundColor: primaryColor,
            color: '#fff',
            fontWeight: 500,
            borderRadius: '8px',
            padding: '8px 16px',
            fontFamily: "'Kanit', sans-serif",
          }
        }}
      />
    </Box>
  );
}

export default App;
