import React, { useState, useCallback } from 'react';
import { TextField, Box, Typography, Snackbar, IconButton, Button, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import QrCode2Icon from '@mui/icons-material/QrCode2';

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

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(url);
    setSnackbarMessage('คัดลอก URL สำเร็จ');
    setOpenSnackbar(true);
  }, [url]);

  const handleDownload = useCallback(() => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      setSnackbarMessage('ดาวน์โหลด QR Code สำเร็จ');
      setOpenSnackbar(true);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
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

          {/* Size Options */}
          <Box sx={{ mb: 3 }}>
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

          {/* Color Picker */}
          <Box sx={{ mb: 3 }}>
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
                  onClick={() => document.getElementById('colorPicker').click()}
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
              <input
                id="colorPicker"
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                style={{ display: 'none' }}
              />
            </Box>
          </Box>

          {/* QR Code Display */}
          {qrCode && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                }}
              >
                <QRCodeSVG
                  id="qr-code"
                  value={qrCode}
                  size={getQrSize()}
                  fgColor={qrColor}
                  style={{ display: 'block' }}
                />

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <Tooltip title="คัดลอก URL" arrow>
                    <IconButton
                      onClick={handleCopyClick}
                      size="small"
                      sx={{
                        backgroundColor: '#f3f4f6',
                        color: textSecondary,
                        '&:hover': {
                          backgroundColor: primaryColor,
                          color: '#fff',
                        },
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="ดาวน์โหลด QR Code" arrow>
                    <IconButton
                      onClick={handleDownload}
                      size="small"
                      sx={{
                        backgroundColor: '#f3f4f6',
                        color: textSecondary,
                        '&:hover': {
                          backgroundColor: primaryColor,
                          color: '#fff',
                        },
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

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
