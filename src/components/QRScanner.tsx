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
import { Loader2, QrCode, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string, studentEmail?: string) => void;
  eventId: string;
  eventName: string;
  studentEmail?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({
  isOpen,
  onClose,
  onScan,
  eventId,
  eventName,
  studentEmail,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedStudentId, setScannedStudentId] = useState<string | null>(null);
  const [scannedStudentEmail, setScannedStudentEmail] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isOpen) {
      checkCamera();
      if (hasCamera) {
        startScanner();
      }
      // Reset states when opening
      setScanSuccess(false);
      setScannedStudentId(null);
      setScannedStudentEmail(null);
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
    setScanSuccess(false);

    try {
      // In a real implementation, we would initialize a QR scanner library here
      // For this demo, we'll simulate a successful scan after a delay
      setTimeout(() => {
        // Mock student data in QR code (format: student:studentId:studentEmail:timestamp)
        const mockStudentId = `S${Math.floor(10000 + Math.random() * 90000)}`;
        const mockStudentEmail =
          studentEmail ||
          localStorage.getItem("studentEmail") ||
          "student@college.edu";
        const mockQRData = `student:${mockStudentId}:${mockStudentEmail}:${Date.now()}`;
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

  const handleScan = async (data: string) => {
    if (data) {
      stopScanner();

      try {
        // Parse the QR data (format: student:studentId:studentEmail:timestamp)
        const parts = data.split(":");
        if (parts.length >= 3 && parts[0] === "student") {
          const studentId = parts[1];
          const email = parts[2];

          setScannedStudentId(studentId);
          setScannedStudentEmail(email);
          setScanSuccess(true);

          // Pass the data to the parent component along with the email
          onScan(data, email);
        } else {
          setError("Invalid QR code format. Please try again.");
        }
      } catch (err) {
        console.error("Error processing QR code:", err);
        setError("Failed to process QR code. Please try again.");
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    setScanSuccess(false);
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

          {scanSuccess ? (
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Student Scanned Successfully
              </h3>
              <div className="bg-muted p-4 rounded-lg w-full mb-4">
                <p className="mb-2">
                  <strong>Student ID:</strong> {scannedStudentId}
                </p>
                <p>
                  <strong>Email:</strong> {scannedStudentEmail}
                </p>
              </div>
              <p className="text-sm text-center text-muted-foreground mb-4">
                A verification email has been sent to the student's email
                address.
              </p>
            </div>
          ) : (
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
          )}

          {!scanSuccess && !error && (
            <p className="text-sm text-center text-muted-foreground mb-4">
              Position the QR code within the frame to scan
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isScanning}>
            {scanSuccess ? "Close" : "Cancel"}
          </Button>
          {error ? (
            <Button onClick={handleRetry} disabled={isScanning}>
              Retry
            </Button>
          ) : scanSuccess ? (
            <Button onClick={handleRetry}>Scan Another</Button>
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
