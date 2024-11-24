import React, { useState, useRef } from "react";
import loaderGif from "../.././assets/Hourglass.gif";
import record from "../.././assets/mic.png";
import { StopButton } from "../../utils/constants";
import { Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function AudioDiagnosticTool() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [latencyData, setLatencyData] = useState([]);
  const [latency, setLatency] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [testIndex, setTestIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [latencyStart, setLatencyStart] = useState(0);

  //console.log('inxxx', testIndex);

  const startRecording = () => {
    //console.log('Starting recording...');
    audioChunksRef.current = [];
    const stream = navigator.mediaDevices.getUserMedia({ audio: true });

    stream
      .then((mediaStream) => {
        mediaRecorderRef.current = new MediaRecorder(mediaStream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          setAudioBlob(audioBlob);
          setAudioUrl(URL.createObjectURL(audioBlob));
          //console.log('Recording stopped, audioBlob set.');
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setLatencyStart(Date.now());
      })
      .catch((err) => {
        console.error("Error accessing audio devices:", err);
      });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    // Capture latency time
    const latency = Date.now() - latencyStart;
    //console.log(`Latency for this recording: ${latency} ms`);
    setLatencyData((prev) => [...prev, latency]);
    setLatency(latency);
  };

  const nextTest = () => {
    setLoading(true); // Start loader

    setTimeout(() => {
      setLoading(false); // Stop loader

      if (testIndex === 0) {
        analyzeLatencyTest(latency);
      } else if (testIndex === 1) {
        analyzeNoiseTest();
      } else if (testIndex === 2) {
        analyzeOtherTest();
      }
    }, 2500);
    setTestIndex((prev) => prev + 1);
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const analyzeLatencyTest = (latency) => {
    //console.log('Analyzing latency test...');
    setTestResults((prev) => [
      ...prev,
      { test: "Latency", result: `${latency} ms` },
    ]);
    //setTestIndex(1); // Move to the next test (Noise Test)
  };

  const analyzeNoiseTest = () => {
    //console.log('Analyzing noise test...');
    blobToAudioBuffer(audioBlob)
      .then(analyzeAudioBuffer)
      .then((analysisReport) => {
        setTestResults((prev) => [
          ...prev,
          { test: "Noise Level", result: analysisReport.noiseLevelDescription },
        ]);
        //setTestIndex(2); // Move to the next test (Other Test)
      })
      .catch(console.error);
  };

  const analyzeOtherTest = () => {
    //console.log('Analyzing other test...');
    blobToAudioBuffer(audioBlob)
      .then(analyzeAudioBuffer)
      .then((analysisReport) => {
        const audioQualityDescription =
          getAudioQualityDescription(analysisReport);
        setTestResults((prev) => [
          ...prev,
          { test: "Audio Quality", result: audioQualityDescription },
        ]);
        //setTestIndex(3); // All tests completed
      })
      .catch(console.error);
  };

  const getAudioQualityDescription = (analysisReport) => {
    const noiseLevel = analysisReport.noiseLevel;
    if (noiseLevel >= 8) return "Excellent";
    if (noiseLevel >= 6) return "Good";
    if (noiseLevel >= 4) return "Average";
    return "Poor";
  };

  const blobToAudioBuffer = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onloadend = () => {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        audioContext.decodeAudioData(reader.result, resolve, reject);
      };
      reader.onerror = reject;
    });
  };
  const analyzeAudioBuffer = (audioBuffer) => {
    const channelData = audioBuffer.getChannelData(0); // Assuming mono audio
    const noiseLevel = getNoiseLevel(channelData);
    const noiseLevelRating = normalizeNoiseLevel(noiseLevel);
    const noiseLevelDescription = getDescription(
      noiseLevelRating,
      "noise level"
    );
    return {
      noiseLevel: noiseLevelRating,
      noiseLevelDescription,
    };
  };

  const getNoiseLevel = (channelData) => {
    const noise = channelData.filter((value) => Math.abs(value) < 0.01).length;
    return noise / channelData.length;
  };

  const normalizeNoiseLevel = (noiseLevel) => {
    return Math.min(10, ((1 - noiseLevel) / 0.2) * 10);
  };

  const getDescription = (rating, type) => {
    if (type === "noise level") {
      if (rating >= 8) return "Very quiet";
      if (rating >= 6) return "Quiet";
      if (rating >= 4) return "Moderate noise";
      return "Noisy";
    }
  };

  // Chart data and options for latency graph
  const latencyChartData = {
    labels: latencyData.map((_, index) => `Test ${index + 1}`),
    datasets: [
      {
        label: "Latency (ms)",
        data: latencyData,
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  const latencyChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Display final results when all tests are complete
  const displayFinalResults = () => {
    const idealRanges = [
      { test: "Latency", idealRange: "0 - 150 ms" },
      { test: "Noise Level", idealRange: "0 - 4 (lower is better)" },
      { test: "Audio Quality", idealRange: "Excellent - Poor" },
    ];

    if (testIndex === 3) {
      return (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontWeight: 600,
              fontSize: "18px",
              fontFamily: "Quicksand",
              alignItems: "center",
              margin: "10px",
            }}
          >
            Audio Performance Test Results
          </h3>
          <span
            style={{
              fontWeight: 600,
              fontSize: "16px",
              fontFamily: "Quicksand",
              alignItems: "center",
              margin: "10px",
            }}
          >
            Audio Quality Test
          </span>
          <ul>
            {testResults.map((result, index) => (
              <li key={result.test}>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "15px",
                    fontFamily: "Quicksand",
                    alignItems: "center",
                  }}
                >
                  {result.test}: {result.result}
                </span>
              </li>
            ))}
          </ul>
          <span
            style={{
              fontWeight: 600,
              fontSize: "16px",
              fontFamily: "Quicksand",
              alignItems: "center",
              margin: "10px",
            }}
          >
            Audio Latency Test
          </span>
          <div
            style={{
              marginBottom: "40px",
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {latencyData.length > 0 && (
              <div style={{ width: "100%", marginBottom: "35px" }}>
                <Line data={latencyChartData} options={latencyChartOptions} />
              </div>
            )}
            <table
              style={{
                width: "80%",
                //borderCollapse: "collapse",
                marginTop: "20px",
                border: "1px solid lightgrey",
                borderRadius: "10px",
                borderCollapse: "separate",
                borderSpacing: "0",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid lightgrey",
                      padding: "8px",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: "16px",
                      fontFamily: "Quicksand",
                      borderTopLeftRadius: "10px",
                    }}
                  >
                    Test
                  </th>
                  <th
                    style={{
                      border: "1px solid lightgrey",
                      padding: "8px",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: "16px",
                      fontFamily: "Quicksand",
                      borderTopRightRadius: "10px",
                    }}
                  >
                    Ideal Range
                  </th>
                </tr>
              </thead>
              <tbody>
                {idealRanges.map((range, index) => (
                  <tr key={range}>
                    <td
                      style={{
                        border: "1px solid lightgrey",
                        padding: "8px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "16px",
                        fontFamily: "Quicksand",
                        borderBottomLeftRadius:
                          index === idealRanges.length - 1 ? "10px" : "0",
                      }}
                    >
                      {range.test}
                    </td>
                    <td
                      style={{
                        border: "1px solid lightgrey",
                        padding: "8px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "16px",
                        fontFamily: "Quicksand",
                        borderBottomRightRadius:
                          index === idealRanges.length - 1 ? "10px" : "0",
                      }}
                    >
                      {range.idealRange}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  const TestSection = ({
    title,
    isRecording,
    startRecording,
    stopRecording,
    record,
    testIndex,
    currentIndex,
    loading,
  }) => {
    if (testIndex !== currentIndex || loading) return null;

    return (
      <div
        style={{
          margin: "20px 10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            margin: "20px 10px",
            fontWeight: 600,
            fontSize: "17px",
            fontFamily: "Quicksand",
            alignItems: "center",
          }}
        >
          {title}
        </span>
        {!isRecording && (
          <RecordingButton startRecording={startRecording} record={record} />
        )}
        {isRecording && (
          <Box sx={{ cursor: "pointer" }} onClick={stopRecording}>
            <StopButton />
          </Box>
        )}
      </div>
    );
  };

  const RecordingButton = ({ startRecording, record }) => (
    <div
      onClick={startRecording}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          startRecording();
        }
      }}
    >
      <img src={record} alt="Record" style={{ height: "50px" }} />
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Show record button or next step button based on testIndex */}

      <TestSection
        title="Latency Test"
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        record={record}
        testIndex={testIndex}
        currentIndex={0}
        loading={loading}
      />
      <TestSection
        title="Noise Level Test"
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        record={record}
        testIndex={testIndex}
        currentIndex={1}
        loading={loading}
      />
      <TestSection
        title="Audio Quality Test"
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        record={record}
        testIndex={testIndex}
        currentIndex={2}
        loading={loading}
      />

      {loading && (
        <div
          style={{
            margin: "30px 10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={loaderGif}
            alt="Loading Animation"
            style={{ width: "60px", height: "60px" }}
          />
        </div>
      )}
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
      {!loading && audioBlob && (
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          mt={5}
          mb={3}
          // mr="110px"
        >
          <Box
            onClick={nextTest}
            sx={{
              cursor: "pointer",
              background: "#6DAF19",
              minWidth: "173px",
              height: "45px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "15px",
                fontFamily: "Quicksand",
                display: "flex",
                alignItems: "center",
              }}
            >
              {"Next"}
            </span>
          </Box>
        </Box>
      )}

      {!loading && displayFinalResults()}
    </div>
  );
}

export default AudioDiagnosticTool;
