
  //TỔNG QUAN ĐƠN HÀNG HÔM NAY CHART
  var ctxD = document.getElementById("donHangChart").getContext('2d');
  var myLineChart = new Chart(ctxD, {
    type: 'doughnut',
    data: {
      labels: ["Red", "Green", "Yellow", "Grey", "Dark Grey"],
      datasets: [{
        data: [300, 50, 100, 40, 120],
        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
      }]
    },
    options: {
      legend: {
        display: false
      },
      responsive: true
    }
  });

  //TỔNG QUAN TOP 10 DỊCH VỤ CHẠRT
  new Chart(document.getElementById("10dichVuChart"), {
    "type": "horizontalBar",
    "data": {
      "labels": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Grey"],
      "datasets": [{
        "label": "My First Dataset",
        "data": [22, 33, 55, 12, 86, 23, 14],
        "fill": false,
        "backgroundColor": ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)"
        ],
        "borderColor": ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)",
          "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)"
        ],
        "borderWidth": 1
      }]
    },
    "options": {
      legend: {
        display: false
      },
      "scales": {
        "xAxes": [{
          "ticks": {
            "beginAtZero": true
          }
        }]
      }
    }
  });


  // TỔNG QUAN DOANH THU CHART
  var ctx = document.getElementById("doanhThuThangNayChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      mainAspectRatio: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

