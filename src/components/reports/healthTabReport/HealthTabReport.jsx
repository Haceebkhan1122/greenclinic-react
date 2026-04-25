import React, { useState, useEffect } from 'react'
import { Col, Form, Row } from "react-bootstrap"
import { DatePicker } from 'antd';
import "./healthTabReport.scss"
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import moment from "moment";
import API from '../../../services/httpInstance/index';

const HealthTabReport = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [medicineGraph, setMedicineGraph] = useState([]);
  const [healthLabGraph, setHealthLabGraph] = useState([]);
  const [procedureGraph, setProcedureGraph] = useState([]);
  const [reasonForVisitGraph, setReasonForVisitGraph] = useState([]);
  const [pastMedicalGraph, setPastMedicalGraph] = useState([]);
  const [allergiesGraph, setAllergiesGraph] = useState([]);
  const [currentDiagnosisGraph, setCurrentDiagnosisGraph] = useState([]);

  const handleDateChange = (date) => {
    let formatDate = dayjs(date).format('YYYY/MM/DD')
    setSelectedDate(formatDate)
  }

  const onChange = (date, dateString) => {
    setSelectedYear(dateString)
  };

  const [medicineGraphData, setMedicineGraphData] = useState({
    series: [],
    options: {
      chart: {
        width: 420, // Increased width
        type: "pie",
      },
      labels: [],
      colors: [],
      dataLabels: {
        enabled: false, // Hides numbers inside the chart
      },
      tooltip: {
        enabled: true, // Shows values on hover
        y: {
          formatter: (val, { seriesIndex, w }) => {
            const percentage = w.config.series[seriesIndex]; // Fetch total_count dynamically
            return `${percentage}`; // Show total_count in tooltip
          },
        }
      },
      legend: {
        show: true,
        position: "right",
      },
      stroke: {
        show: false, // Removes white border
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300, // Adjust for smaller screens
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const [healthLabGraphData, setHealthLabGraphData] = useState({
    series: [],
    options: {
      chart: {
        width: 420, // Increased width
        type: "pie",
      },
      labels: [],
      colors: [],
      dataLabels: {
        enabled: false, // Hides numbers inside the chart
      },
      tooltip: {
        enabled: true, // Shows values on hover
        y: {
          formatter: (val, { seriesIndex, w }) => {
            const percentage = w.config.series[seriesIndex]; // Fetch total_count dynamically
            return `${percentage}`; // Show total_count in tooltip
          },
        }
      },
      stroke: {
        show: false, // Removes white border
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300, // Adjust for smaller screens
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const [procedureGraphData, setProcedureGraphData] = useState({
    series: [],
    options: {
      chart: {
        width: 420, // Increased width
        type: "pie",
      },
      labels: [],
      colors: [],
      dataLabels: {
        enabled: false, // Hides numbers inside the chart
      },
      tooltip: {
        enabled: true, // Shows values on hover
        y: {
          formatter: (val, { seriesIndex, w }) => {
            const percentage = w.config.series[seriesIndex]; // Fetch total_count dynamically
            return `${percentage}`; // Show total_count in tooltip
          },
        }
      },
      stroke: {
        show: false, // Removes white border
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300, // Adjust for smaller screens
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const [reasonForVisitGraphData, setReasonForVisitGraphData] = useState({
    series: [],
    options: {
      chart: {
        width: 420, // Increased width
        type: "pie",
      },
      labels: [],
      colors: [],
      dataLabels: {
        enabled: false, // Hides numbers inside the chart
      },
      tooltip: {
        enabled: true, // Shows values on hover
        y: {
          formatter: (val, { seriesIndex, w }) => {
            const percentage = w.config.series[seriesIndex]; // Fetch total_count dynamically
            return `${percentage}`; // Show total_count in tooltip
          },
        }
      },
      stroke: {
        show: false, // Removes white border
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300, // Adjust for smaller screens
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const [pastMedicalGraphData, setPastMedicalGraphData] = useState({
    series: [],
    options: {
      chart: {
        width: 420, // Increased width
        type: "pie",
      },
      labels: [],
      colors: [],
      dataLabels: {
        enabled: false, // Hides numbers inside the chart
      },
      tooltip: {
        enabled: true, // Shows values on hover
        y: {
          formatter: (val, { seriesIndex, w }) => {
            const percentage = w.config.series[seriesIndex]; // Fetch total_count dynamically
            return `${percentage}`; // Show total_count in tooltip
          },
        }
      },
      stroke: {
        show: false, // Removes white border
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300, // Adjust for smaller screens
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const [allergiesGraphData, setAllergiesGraphData] = useState({
    series: [],
    options: {
      chart: {
        width: 420, // Increased width
        type: "pie",
      },
      labels: [],
      colors: [],
      dataLabels: {
        enabled: false, // Hides numbers inside the chart
      },
      tooltip: {
        enabled: true, // Shows values on hover
        y: {
          formatter: (val, { seriesIndex, w }) => {
            const percentage = w.config.series[seriesIndex]; // Fetch total_count dynamically
            return `${percentage}`; // Show total_count in tooltip
          },
        }
      },
      stroke: {
        show: false, // Removes white border
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300, // Adjust for smaller screens
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const [currentDiagnosisGraphData, setCurrentDiagnosisGraphData] = useState({
    series: [],
    options: {
      chart: {
        width: 420, // Increased width
        type: "pie",
      },
      labels: [],
      colors: [],
      dataLabels: {
        enabled: false, // Hides numbers inside the chart
      },
      tooltip: {
        enabled: true, // Shows values on hover
        y: {
          formatter: (val, { seriesIndex, w }) => {
            const percentage = w.config.series[seriesIndex]; // Fetch total_count dynamically
            return `${percentage}`; // Show total_count in tooltip
          },
        }
      },
      stroke: {
        show: false, // Removes white border
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300, // Adjust for smaller screens
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  // Ensure the chart updates with API data
  useEffect(() => {
    if (medicineGraph?.length) {
      setMedicineGraphData({
        series: medicineGraph.map((item) => parseFloat(item.percentage)), // Convert to float

        options: {
          ...medicineGraphData.options,
          labels: medicineGraph.map((item) => item.name),
          colors: medicineGraph.map((item) => item.color),
          tooltip: {
            enabled: true,
            y: {
              formatter: (val, { seriesIndex }) => {
                const percentage = medicineGraph[seriesIndex]?.percentage || 0;
                return `  ${percentage}`; // Display percentage in tooltip
              },
            },
          },
        },
      });
    }
  }, [medicineGraph]);

  useEffect(() => {
    if (healthLabGraph?.length) {
      setHealthLabGraphData({
        series: healthLabGraph.map((item) => parseFloat(item.percentage)), // Convert to float
        options: {
          ...healthLabGraphData.options,
          labels: healthLabGraph.map((item) => item.name),
          colors: healthLabGraph.map((item) => item.color),
          tooltip: {
            enabled: true,
            y: {
              formatter: (val, { seriesIndex }) => {
                const percentage = healthLabGraph[seriesIndex]?.percentage || 0;
                return `  ${percentage}`; // Display percentage in tooltip
              },
            },
          },
        },
      });
    }
  }, [healthLabGraph]);

  useEffect(() => {
    if (procedureGraph?.length) {
      setProcedureGraphData({
        series: procedureGraph.map((item) => parseFloat(item.percentage)), // Convert to float
        options: {
          ...procedureGraphData.options,
          labels: procedureGraph.map((item) => item.name),
          colors: procedureGraph.map((item) => item.color),
          tooltip: {
            enabled: true,
            y: {
              formatter: (val, { seriesIndex }) => {
                const percentage = procedureGraph[seriesIndex]?.percentage || 0;
                return `  ${percentage}`; // Display percentage in tooltip
              },
            },
          },
        },
      });
    }
  }, [procedureGraph]);

  useEffect(() => {
    if (reasonForVisitGraph?.length) {
      setReasonForVisitGraphData({
        series: reasonForVisitGraph.map((item) => parseFloat(item.percentage)), // Convert to float
        options: {
          ...reasonForVisitGraphData.options,
          labels: reasonForVisitGraph.map((item) => item.name),
          colors: reasonForVisitGraph.map((item) => item.color),
          tooltip: {
            enabled: true,
            y: {
              formatter: (val, { seriesIndex }) => {
                const percentage = reasonForVisitGraph[seriesIndex]?.percentage || 0;
                return `  ${percentage}`; // Display percentage in tooltip
              },
            },
          },
        },
      });
    }
  }, [reasonForVisitGraph]);

  useEffect(() => {
    if (pastMedicalGraph?.length) {
      setPastMedicalGraphData({
        series: pastMedicalGraph.map((item) => parseFloat(item.percentage)), // Convert to float
        options: {
          ...pastMedicalGraphData.options,
          labels: pastMedicalGraph.map((item) => item.name),
          colors: pastMedicalGraph.map((item) => item.color),
          tooltip: {
            enabled: true,
            y: {
              formatter: (val, { seriesIndex }) => {
                const percentage = pastMedicalGraph[seriesIndex]?.percentage || 0;
                return `  ${percentage}`; // Display percentage in tooltip
              },
            },
          },
        },
      });
    }
  }, [pastMedicalGraph]);


  useEffect(() => {
    if (allergiesGraph?.length) {
      setAllergiesGraphData({
        series: allergiesGraph.map((item) => parseFloat(item.percentage)), // Convert to float
        options: {
          ...allergiesGraphData.options,
          labels: allergiesGraph.map((item) => item.name),
          colors: allergiesGraph.map((item) => item.color),
          tooltip: {
            enabled: true,
            y: {
              formatter: (val, { seriesIndex }) => {
                const percentage = allergiesGraph[seriesIndex]?.percentage || 0;
                return `  ${percentage}`; // Display percentage in tooltip
              },
            },
          },
        },
      });
    }
  }, [allergiesGraph]);

  useEffect(() => {
    if (currentDiagnosisGraph?.length) {
      setCurrentDiagnosisGraphData({
        series: currentDiagnosisGraph.map((item) => parseFloat(item.percentage)), // Convert to float
        options: {
          ...currentDiagnosisGraphData.options,
          labels: currentDiagnosisGraph.map((item) => item.name),
          colors: currentDiagnosisGraph.map((item) => item.color),
          tooltip: {
            enabled: true,
            y: {
              formatter: (val, { seriesIndex }) => {
                const percentage = currentDiagnosisGraph[seriesIndex]?.percentage || 0;
                return `  ${percentage}`; // Display percentage in tooltip
              },
            },
          },
        },
      });
    }
  }, [currentDiagnosisGraph]);

  const getMedicineGraph = async () => {
    try {
      const response = await API.get(`/reports/medicine-graph`);
      if (response?.status == 200) {
        setMedicineGraph(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getHealthLabGraph = async () => {
    try {
      const response = await API.get(`/reports/health-lab-graph`);
      if (response?.status == 200) {
        setHealthLabGraph(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getProcedureGraph = async () => {
    try {
      const response = await API.get(`/reports/procedure-graph`);
      if (response?.status == 200) {
        setProcedureGraph(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getReasonForVisitGraph = async () => {
    try {
      const response = await API.get(`/reports/reason-for-visit-graph`);
      if (response?.status == 200) {
        setReasonForVisitGraph(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getPastMedicalGraph = async () => {
    try {
      const response = await API.get(`/reports/past-medical-history-graph`);
      if (response?.status == 200) {
        setPastMedicalGraph(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllergiesGraph = async () => {
    try {
      const response = await API.get(`/reports/allergies-graph`);
      if (response?.status == 200) {
        setAllergiesGraph(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentDiagnosisGraph = async () => {
    try {
      const response = await API.get(`/reports/current-diagnosis-graph`);
      if (response?.status == 200) {
        setCurrentDiagnosisGraph(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMedicineGraph();
    getHealthLabGraph();
    getProcedureGraph();
    getReasonForVisitGraph();
    getPastMedicalGraph();
    getAllergiesGraph();
    getCurrentDiagnosisGraph();
  }, [])


  return (
    <div className='healthReportTab'>
      {/* <div className="top-bar-filter">
        <span> Filter by </span>
        <div className="custom_date_report">
          <DatePicker name='dob' onChange={handleDateChange} />
        </div>
        <div className="custom_date_reportYear">
          <DatePicker onChange={onChange} picker="year" />
        </div>
        <div className="custom_search_bar_report">
          <span className='search_icon'>  </span>
          <input type="text" placeholder='Search for appointment' />
        </div>
      </div> */}
      <div className="bottom-bar-card">
        <Row>
          <Col lg={4}>
            <div className="box">
              <div className="box-wrap">
                <h5>Medicines</h5>
                <span>Top 5 medicines prescribed</span>
              </div>
              <div className='box-chart1'>
                <div className='boxLeft'>
                  {medicineGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...medicineGraphData.options,
                        chart: { width: 100, height: 100 },
                        legend: { show: false },
                      }}
                      series={medicineGraphData.series}
                      type="pie"
                      width={200}
                      height={200}
                    />
                  )}
                </div>
                <div className='boxRight'>

                  <ul className='legendList'>
                    {medicineGraphData?.options?.labels.map((label, index) => (
                      <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                        <span className='boxColor'
                          style={{
                            backgroundColor: medicineGraphData.options.colors[index],

                          }}
                        ></span>
                        <span className='boxHeading' style={{ whiteSpace: "normal", wordBreak: "break-word", flex: 1 }}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/medications">View List</Link>
              </div>
              <div className="box-chart d-none">
                <div id="chart">
                  {medicineGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...medicineGraphData.options,
                        chart: { width: 500, height: 600 }, // Chart size increase
                        legend: { fontSize: "10px" } // Legend text chhota
                      }}
                      series={medicineGraphData.series}
                      type="pie"
                      width={460} // Increased width
                      height={300} // Added height
                    />
                  )}
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/medications">View List</Link>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="box">
              <div className="box-wrap">
                <h5>Labs</h5>
                <span>Top 5 Labs prescribed</span>
              </div>
              <div className='box-chart1'>
                <div className='boxLeft'>
                  {healthLabGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...healthLabGraphData?.options,
                        chart: { width: 100, height: 100 },
                        legend: { show: false }, //   Hide Legends from Chart
                      }}
                      series={healthLabGraphData?.series}
                      type="pie"
                      width={200}
                      height={200}
                    />
                  )}
                </div>
                <div className='boxRight'>

                  <ul className='legendList'>
                    {healthLabGraphData?.options?.labels.map((label, index) => (
                      <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                        <span className='boxColor'
                          style={{
                            backgroundColor: healthLabGraphData.options.colors[index],

                          }}
                        ></span>
                        <span className='boxHeading' style={{ whiteSpace: "normal", wordBreak: "break-word", flex: 1 }}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/labs">View List</Link>
              </div>

              <div className="box-chart c2 d-none">
                <div id="chart">
                  {healthLabGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...healthLabGraphData?.options,
                        chart: { width: 500, height: 600 }, // Chart size increase
                        legend: { fontSize: "10px" } // Legend text chhota
                      }}
                      series={healthLabGraphData?.series}
                      type="pie"
                      width={460} // Increased width
                      height={300} // Added height
                    />
                  )}
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/labs">View List</Link>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="box">
              <div className="box-wrap">
                <h5>Procedures</h5>
                <span>Top 5 Procedures prescribed</span>
              </div>
              <div className='box-chart1'>
                <div className='boxLeft'>
                  {procedureGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...procedureGraphData?.options,
                        chart: { width: 100, height: 100 },
                        legend: { show: false }, //   Hide Legends from Chart
                      }}
                      series={procedureGraphData?.series}
                      type="pie"
                      width={200}
                      height={200}
                    />
                  )}
                </div>
                <div className='boxRight'>
                  <ul className='legendList'>
                    {procedureGraphData?.options?.labels.map((label, index) => (
                      <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                        <span className='boxColor'
                          style={{
                            backgroundColor: procedureGraphData.options.colors[index],

                          }}
                        ></span>
                        <span className='boxHeading' style={{ whiteSpace: "normal", wordBreak: "break-word", flex: 1 }}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/procedures">View List</Link>
              </div>
              <div className="box-chart d-none">
                <div id="chart">
                  {procedureGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...procedureGraphData.options,
                        chart: { width: 500, height: 600 }, // Chart size increase
                        legend: { fontSize: "10px" } // Legend text chhota
                      }}
                      series={procedureGraphData.series}
                      type="pie"
                      width={460} // Increased width
                      height={300} // Added height
                    />
                  )}
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/procedures">View List</Link>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="box">
              <div className="box-wrap">
                <h5>Reason for Visit</h5>
                <span>Top 5 Reason for Visit</span>
              </div>
              <div className='box-chart1'>
                <div className='boxLeft'>
                  {reasonForVisitGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...reasonForVisitGraphData.options,
                        chart: { width: 100, height: 100 },
                        legend: { show: false }, //   Hide Legends from Chart
                      }}
                      series={reasonForVisitGraphData.series}
                      type="pie"
                      width={200}
                      height={200}
                    />
                  )}
                </div>
                <div className='boxRight'>
                  <ul className='legendList'>
                    {reasonForVisitGraphData?.options?.labels.map((label, index) => (
                      <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                        <span className='boxColor'
                          style={{
                            backgroundColor: reasonForVisitGraphData.options.colors[index],

                          }}
                        ></span>
                        <span className='boxHeading' style={{ whiteSpace: "normal", wordBreak: "break-word", flex: 1 }}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/reason-visit">View List</Link>
              </div>
              <div className="box-chart d-none">
                <div id="chart">
                  {reasonForVisitGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...reasonForVisitGraphData.options,
                        chart: { width: 500, height: 600 }, // Chart size increase
                        legend: { fontSize: "10px" } // Legend text chhota
                      }}
                      series={reasonForVisitGraphData.series}
                      type="pie"
                      width={460} // Increased width
                      height={300} // Added height
                    />
                  )}
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/reason-visit">View List</Link>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="box">
              <div className="box-wrap">
                <h5>Past Medical History</h5>
                <span>Top 5 Medical History</span>
              </div>

              <div className='box-chart1'>
                <div className='boxLeft'>
                  {pastMedicalGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...pastMedicalGraphData.options,
                        chart: { width: 100, height: 100 },
                        legend: { show: false }, //   Hide Legends from Chart
                      }}
                      series={pastMedicalGraphData.series}
                      type="pie"
                      width={200}
                      height={200}
                    />
                  )}
                </div>
                <div className='boxRight'>
                  <ul className='legendList'>
                    {pastMedicalGraphData?.options?.labels.map((label, index) => (
                      <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                        <span className='boxColor'
                          style={{
                            backgroundColor: pastMedicalGraphData.options.colors[index],

                          }}
                        ></span>
                        <span className='boxHeading' style={{ whiteSpace: "normal", wordBreak: "break-word", flex: 1 }}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/past-medical-history">View List</Link>
              </div>
              <div className="box-chart d-none">
                <div id="chart">
                  {pastMedicalGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...pastMedicalGraphData.options,
                        chart: { width: 500, height: 600 }, // Chart size increase
                        legend: { fontSize: "10px" } // Legend text chhota
                      }}
                      series={pastMedicalGraphData.series}
                      type="pie"
                      width={460} // Increased width
                      height={300} // Added height
                    />
                  )}
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/past-medical-history">View List</Link>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="box">
              <div className="box-wrap">
                <h5>Allergies</h5>
                <span>Top 5 Allergies</span>
              </div>
              <div className='box-chart1'>
                <div className='boxLeft'>
                  {allergiesGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...pastMedicalGraphData.options,
                        chart: { width: 100, height: 100 },
                        legend: { show: false }, //   Hide Legends from Chart
                      }}
                      series={allergiesGraphData.series}
                      type="pie"
                      width={200}
                      height={200}
                    />
                  )}

                </div>
                <div className='boxRight'>
                  <ul className='legendList'>
                    {allergiesGraphData?.options?.labels.map((label, index) => (
                      <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                        <span className='boxColor'
                          style={{
                            backgroundColor: allergiesGraphData.options.colors[index],

                          }}
                        ></span>
                        <span className='boxHeading' style={{ whiteSpace: "normal", wordBreak: "break-word", flex: 1 }}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/allergies">View List</Link>
              </div>
              <div className="box-chart d-none">
                <div id="chart">
                  {allergiesGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...allergiesGraphData?.options,
                        chart: { width: 500, height: 600 }, // Chart size increase
                        legend: { fontSize: "10px" } // Legend text chhota
                      }}
                      series={allergiesGraphData?.series}
                      type="pie"
                      width={460} // Increased width
                      height={300} // Added height
                    />
                  )}
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/allergies">View List</Link>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="box">
              <div className="box-wrap">
                <h5>Indications</h5>
                <span>Top 5 Indications</span>
              </div>

              <div className='box-chart1'>
                <div className='boxLeft'>
                  {currentDiagnosisGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...currentDiagnosisGraphData.options,
                        chart: { width: 100, height: 100 },
                        legend: { show: false }, //   Hide Legends from Chart
                      }}
                      series={currentDiagnosisGraphData.series}
                      type="pie"
                      width={200}
                      height={200}
                    />
                  )}
                </div>
                <div className='boxRight'>
                  <ul className='legendList'>
                    {currentDiagnosisGraphData?.options?.labels.map((label, index) => (
                      <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                        <span className='boxColor'
                          style={{
                            backgroundColor: currentDiagnosisGraphData.options.colors[index],

                          }}
                        ></span>
                        <span className='boxHeading' style={{ whiteSpace: "normal", wordBreak: "break-word", flex: 1 }}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/indications">View List</Link>
              </div>
              <div className="box-chart d-none">
                <div id="chart">
                  {currentDiagnosisGraphData?.series?.length > 0 && (
                    <ReactApexChart
                      options={{
                        ...currentDiagnosisGraphData?.options,
                        chart: { width: 500, height: 600 }, // Chart size increase
                        legend: { fontSize: "10px" } // Legend text chhota
                      }}
                      series={currentDiagnosisGraphData?.series}
                      type="pie"
                      width={460} // Increased width
                      height={300} // Added height
                    />
                  )}
                </div>
                <div id="html-dist"></div>
                <Link className='link' to="/indications">View List</Link>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default HealthTabReport