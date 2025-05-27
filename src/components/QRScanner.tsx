import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2, QrCode, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
  eventId: string;
  eventName: string;
}

const QRScanner: React.FC<QRScannerProps> = ({
  isOpen,
  onClose,
  onScan,
  eventId,
  eventName,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkCamera();
      if (hasCamera) {
        startScanner();
      }
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen, hasCamera]);

  const checkCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );
      setHasCamera(videoDevices.length > 0);
      if (videoDevices.length === 0) {
        setError("No camera detected on your device.");
      }
    } catch (err) {
      console.error("Error checking for camera:", err);
      setError("Unable to access camera. Please check permissions.");
      setHasCamera(false);
    }
  };

  const startScanner = async () => {
    setIsScanning(true);
    setError(null);

    try {
      // In a real implementation, we would initialize a QR scanner library here
      // For this demo, we'll simulate a successful scan after a delay
      setTimeout(() => {
        const mockQRData = `event:${eventId}:${Date.now()}`;
        handleScan(mockQRData);
      }, 3000);
    } catch (err) {
      console.error("Error starting QR scanner:", err);
      setError("Failed to start QR scanner. Please try again.");
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    setIsScanning(false);
    // In a real implementation, we would clean up the QR scanner here
  };

  const handleScan = (data: string) => {
    if (data) {
      stopScanner();
      onScan(data);
    }
  };

  const handleRetry = () => {
    setError(null);
    startScanner();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Scan student QR codes to register them for {eventName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="bg-muted rounded-lg w-64 h-64 flex items-center justify-center mb-4">
            {isScanning ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Scanning...</p>
              </div>
            ) : (
              <QrCode className="h-16 w-16 text-muted-foreground" />
            )}
          </div>

          <p className="text-sm text-center text-muted-foreground mb-4">
            Position the QR code within the frame to scan
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isScanning}>
            Cancel
          </Button>
          {error ? (
            <Button onClick={handleRetry} disabled={isScanning}>
              Retry
            </Button>
          ) : (
            <Button onClick={startScanner} disabled={isScanning || !hasCamera}>
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                "Start Scanning"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
