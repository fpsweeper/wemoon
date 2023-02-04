import { Component, OnInit, ViewChild } from '@angular/core';
import { DarkModeService } from 'angular-dark-mode';
import { Observable } from 'rxjs';
const { hellomoon_bearer } = require('../../config.json');
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js';
import { resolve } from 'path';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    darkMode$: Observable<boolean> = this.darkModeService.darkMode$;
    pageStyle = {
        "desc":"shape shape-style-1 shape-dark"
    }
    
    onToggle(){
        this.darkModeService.toggle();
    }

    model = {
        left: true,
        middle: false,
        right: false
    };

    expandTokenData = true
    loadingToken = false
    swapsearch = ''
    loadingJup = false
    pair = null
    tokensearch = ''
    tokendata = null

    focus;
    focus1;
    
    jupiterStats = null
    chart: any;
    chart2: any;
    chart3: any;
    chart4: any;
    chart5: any;

    chartData = []
    chartLabels = []

    tokenChartData = []
    tokenChartLabels = []

    tokenUsersChartData = []
    tokenUsersChartLabels = []

    nftData = []
    nftLabels = []

    tokenmetadata = null

    collectionsearch = ''
    loadingCollection = false
    collectiondata = null
    expandCollData = false;

    collDistData = []
    collDistLabels = []

    collHoldData = []
    collHoldLabels = []
    topHolders = []
    expandTopHolders = false

    constructor(private darkModeService: DarkModeService) { }

    ngOnInit() {

      this.getTopSwappingPairs().then(() => {
        this.chart = new Chart('canvas', {
            type: 'pie',
            data: {
              labels: this.chartLabels,
              datasets: [
                { 
                  data: this.chartData,
                  backgroundColor: ['rgba(255, 0, 0, 0.5)','rgba(252, 186, 3, 0.5)','rgba(20, 227, 38, 0.5)','rgba(48, 62, 171, 0.5)','rgba(199, 36, 201, 0.5)'],
                  borderWidth: 0
                },
              ]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: 'white'
                  }
                }
              }
            }
          });
      })
      
      this.getCumNftOwners().then(async () => {
        console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrr')
        var chartEl = document.getElementById("canvas3");

        chartEl['height'] = 400;
        if(this.chart3)
          this.chart3.destroy()

        this.chart3 = new Chart('canvas3', {
          type: 'line',
          data: {
            labels: this.nftLabels.reverse(),
            datasets: [
              { 
                label: 'Cumulative NFT owners over time',
                data: this.nftData.reverse(),
                fill: false,
                borderColor: 'rgb(235, 64, 52)',
                tension: 0.1,
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                ticks: { color: 'white'}
              },
              x: {
                ticks: { color: 'white', display: false}
                
              }
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: 'white'
                }
              }
            },
            maintainAspectRatio: false
          }
        });
      });

      this.checkJupiterStats()
    }

    async checkSplStats(){


      const axios = require('axios');

      const options = {
        method: 'POST',
        url: 'https://rest-api.hellomoon.io/v0/token/stats',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer '+hellomoon_bearer
        }
      };

      axios
        .request(options)
        .then(function (response) {

        })
        .catch(function (error) {

        });

    }

    async checkJupiterStats(){


      const axios = require('axios');

      const options = {
        method: 'POST',
        url: 'https://rest-api.hellomoon.io/v0/defi/swaps/jupiter/current-trading',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer '+hellomoon_bearer
        }
      };

      axios
        .request(options)
        .then((response) => {
          this.jupiterStats = response.data.data[0]
        })
        .catch(function (error) {
        });

    }

    async checkJupPair(){
      const axios = require('axios');
      const options = {
        method: 'POST',
        url: 'https://rest-api.hellomoon.io/v0/defi/swaps/jupiter/swapping-pairs',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer '+hellomoon_bearer
        },
        data: {swapPair: this.swapsearch}
      };

      axios
        .request(options)
        .then((response) => {
          this.pair = response.data.data[0]
        })
        .catch(function (error) {
        });
    }

    async checkToken(){

      const axios = require('axios');

      const options = {
        method: 'POST',
        url: 'https://rest-api.hellomoon.io/v0/defi/swaps/jupiter/token-stats',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer '+hellomoon_bearer
        },
        data: {mint: this.tokensearch}
      };

      axios
        .request(options)
        .then((response) => {
          this.tokendata = response.data.data
        })
        .catch(function (error) {
        });
          }

    async searchJup(){
      this.loadingJup = true
      await this.checkJupPair()
      this.loadingJup = false
    }

    async searchToken(){
      this.loadingToken = true
      
      this.newUsersOverTime().then(async () => {
        this.usersOverTime().then(async () => {
          var chartEl = document.getElementById("canvas2");

          chartEl['height'] = 400;
          if(this.chart2)
            this.chart2.destroy()

          this.chart2 = new Chart('canvas2', {
            type: 'line',
            data: {
              labels: this.tokenChartLabels.reverse(),
              datasets: [
                { 
                  label: 'Token New Users Over Time',
                  data: this.tokenChartData.reverse(),
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
                },{ 
                  label: 'Token Users Over Time',
                  data: this.tokenUsersChartData.reverse(),
                  fill: false,
                  borderColor: 'rgb(235, 64, 52)',
                  tension: 0.1,
                }
              ]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  ticks: { color: 'white'}
                },
                x: {
                  ticks: { color: 'white'}
                }
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: 'white'
                  }
                }
              },
              maintainAspectRatio: false
            }
          });

          await this.checkToken()
          await this.getTokenMetadata()

          this.loadingToken = false
        })
        
      })
      
    }

    async getTopSwappingPairs(){

      return new Promise((resolve, reject) => {
        const axios = require('axios');

        const options = {
          method: 'POST',
          url: 'https://rest-api.hellomoon.io/v0/defi/swaps/weekly-pairs',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + hellomoon_bearer
          },
          data: {category: 'Whole market'}
        };

        axios
          .request(options)
          .then((response) => {

            var i = 0;
            while(i <= 4){
              this.chartData.push(response.data.data[i].usdVolume)
              this.chartLabels.push(response.data.data[i].swapPair)
              i++
            }

            resolve(true)
          })
          .catch(function (error) {
            resolve(false)
          });
      })
      
    }

    async newUsersOverTime(){

      return new Promise((resolve, reject) => {
        const axios = require('axios');

        const options = {
          method: 'POST',
          url: 'https://rest-api.hellomoon.io/v0/token/daily_new_purchases',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + hellomoon_bearer
          },
          data: {mint: this.tokensearch}
        };

        axios
          .request(options)
          .then((response) => {
            this.tokenChartData.length = 0
            this.tokenChartLabels.length = 0

            var i = 0;
            while(i <= 9){
              console.log(response.data.data[i].netNewPurchasers + ' ---- ' + response.data.data[i].day)
              this.tokenChartData.push(response.data.data[i].netNewPurchasers)
              this.tokenChartLabels.push(response.data.data[i].day)
              i++
            }
            resolve(true)
          })
          .catch((error) => {
            this.tokenChartData = []
            this.tokenChartLabels = []
            this.tokendata = null
            this.chart2.destroy()
            resolve(false)
          });
      })
      
    }

    async usersOverTime(){

      return new Promise((resolve, reject) => {
        const axios = require('axios');

        const options = {
          method: 'POST',
          url: 'https://rest-api.hellomoon.io/v0/token/daily_active_users',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + hellomoon_bearer
          },
          data: {mint: this.tokensearch}
        };

        axios
          .request(options)
          .then((response) => {
            this.tokenUsersChartData.length = 0
            this.tokenUsersChartLabels.length = 0

            var i = 0;
            while(i <= 9){
              this.tokenUsersChartData.push(response.data.data[i].activeUserCount)
              this.tokenUsersChartLabels.push(response.data.data[i].day)
              i++
            }
            resolve(true)
          })
          .catch((error) => {
            this.tokenUsersChartData = []
            this.tokenUsersChartLabels = []
            this.tokendata = null
            this.chart2.destroy()
            resolve(false)
          });
      })
      
    }

    tokenDataClicked(){
      this.expandTokenData = !this.expandTokenData
    }

    async getTokenMetadata(){
      const axios = require('axios');

      const options = {
        method: 'POST',
        url: 'https://rest-api.hellomoon.io/v0/token/stats',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer ' + hellomoon_bearer
        },
        data: {mint: this.tokensearch}
      };

      axios
        .request(options)
        .then((response) => {
          this.tokenmetadata = response.data.data[1]
          console.log(response.data);
        })
        .catch((error) => {
          this.tokenmetadata = null
        });
    }

    async getCumNftOwners(){

      return new Promise((resolve, reject) => {
        const axios = require('axios');

        const options = {
          method: 'POST',
          url: 'https://rest-api.hellomoon.io/v0/nft/collection/ownership/cumulative',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + hellomoon_bearer
          }
        };

        axios
          .request(options)
          .then((response) => {
            this.nftData.length = 0
            this.nftLabels.length = 0

            var i = 0;
            while(i <= 19){
              this.nftData.push(response.data.data[i].value)
              this.nftLabels.push(response.data.data[i].day)
              i++
            }
            resolve(true)
          })
          .catch((error) => {
            this.nftData = []
            this.nftLabels = []
            this.chart3.destroy()
            resolve(false)
          });
      })

    }

    async searchCollection(){
      this.loadingCollection = true
      await this.getCollData()
      this.getDistCollOwners().then(() => {

        this.getCollHoldingPeriod().then(() => {

          var chartEl = document.getElementById("canvas4");

          chartEl['height'] = 400;
          if(this.chart4)
            this.chart4.destroy()

          var chartEl = document.getElementById("canvas5");

          chartEl['height'] = 400;
          if(this.chart5)
            this.chart5.destroy()

          this.chart4 = new Chart('canvas4', {
            type: 'line',
            data: {
              labels: this.collDistLabels.reverse(),
              datasets: [
                { 
                  label: 'Collection disctinct owners over time',
                  data: this.collDistData.reverse(),
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
                }
              ]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  ticks: { color: 'white'}
                },
                x: {
                  ticks: { color: 'white', display: false}
                }
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: 'white'
                  }
                }
              },
              maintainAspectRatio: false
            }
          });

          this.chart5 = new Chart('canvas5', {
            type: 'bar',
            data: {
              labels: this.collHoldLabels.reverse(),
              datasets: [
                { 
                  label: 'Collection Holding Period',
                  data: this.collHoldData.reverse(),
                  borderColor: 'rgb(75, 192, 192)'
                }
              ]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  ticks: { color: 'white'}
                },
                x: {
                  ticks: { color: 'white'}
                }
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: 'white'
                  }
                }
              },
              maintainAspectRatio: false
            }
          });

          //this.getCollTopHolders()
          this.loadingCollection = false
        })
      })
      
    }

    collDataClicked(){
      this.expandCollData = !this.expandCollData
    }

    async getCollData(){
      const axios = require('axios');

      const options = {
        method: 'POST',
        url: 'https://rest-api.hellomoon.io/v0/nft/collection/stats',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer ' + hellomoon_bearer
        },
        data: {helloMoonCollectionId: this.collectionsearch}
      };

      axios
        .request(options)
        .then((response) => {
          this.collectiondata = response.data.data[0]
          
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    async getDistCollOwners(){

      return new Promise((resolve, reject) => {
        const axios = require('axios');

        const options = {
          method: 'POST',
          url: 'https://rest-api.hellomoon.io/v0/nft/collection/ownership/historical',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + hellomoon_bearer
          },
          data: {helloMoonCollectionId: this.collectionsearch}
        };


        axios
          .request(options)
          .then((response) => {
            this.collDistData.length = 0
            this.collDistLabels.length = 0

            var i = 0;
            while(i <= 19){
              this.collDistData.push(response.data.data[i].numDistinct)
              this.collDistLabels.push(response.data.data[i].day)
              i++
            }
            console.log(response.data)           
            resolve(true)
          })
          .catch((error) => {
            this.collDistData = []
            this.collDistLabels = []
            this.chart4.destroy()
            resolve(false)
          });
      })

    }

    async getCollHoldingPeriod(){

      return new Promise((resolve, reject) => {
        const axios = require('axios');

        const options = {
          method: 'POST',
          url: 'https://rest-api.hellomoon.io/v0/nft/collection/ownership/holding-period',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + hellomoon_bearer
          },
          data: {helloMoonCollectionId: this.collectionsearch}
        };


        axios
          .request(options)
          .then((response) => {
            console.log('rrrrrrrrrrrrrttttttttttttttttttttttttttttttttttttttttt')
            this.collHoldData.length = 0
            this.collHoldLabels.length = 0

            var i = 0;
            while(i < response.data.data.length){
              this.collHoldData.push(response.data.data[i].number)
              this.collHoldLabels.push(response.data.data[i].holdingPeriod)
              i++
            }
            console.log(response.data)           
            resolve(true)
          })
          .catch((error) => {
            this.collHoldData = []
            this.collHoldLabels = []
            this.chart5.destroy()
            resolve(false)
          });
      })

    }

    async getCollTopHolders(){
      const axios = require('axios');

      const options = {
        method: 'POST',
        url: 'https://rest-api.hellomoon.io/v0/nft/collection/ownership/top-holders',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer ' + hellomoon_bearer
        },
        data: {helloMoonCollectionId: this.collectionsearch}
      };

      axios
        .request(options)
        .then((response) => {

          var i = 0
          while(i <= 9){
            this.topHolders.push(response.data.data[i])
          }
        })
        .catch(function (error) {
        });
    }

    topHoldersClicked(){
      this.expandTopHolders = !this.expandTopHolders
    }
}
