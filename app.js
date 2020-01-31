const api = require('./config/api');

async function app(){

  const id = '5e331b87b519d10014bc3864'

  const pricesResponde = await api.get(`data/${id}/prices`);
  const suppliesResponse = await api.get(`data/${id}/supplies`);
  const spentsResponse = await api.get(`data/${id}/spents`);

  const supplies = suppliesResponse.data;
  const prices = pricesResponde.data;
  const spents = spentsResponse.data; 

  const minorDate = calcMinorDate();
  const majorDate = calcMajorDate();

  const result =[];
  
  function calcMinorDate(){
    let date1 = prices[0].date;
    let date2 = supplies[0].date;
    let date3 = spents[0].date;

    let minor = date1;
    
    if(minor > date2){
      minor = date2
    }
    if(minor > date3){
      minor = date3
    }
    return minor;
  }

  function calcMajorDate(date1,date2,date3){ 
    date1= prices[prices.length -1].date;
    date2= supplies[prices.length -1].date;
    date3= spents[prices.length -1].date;
    
    let major = date1;
    if(major < date2){
      major = date2
    }
    if(major < date3){
      major = date3
    }
    return major;
  }

  function daysInMonth(month, year) {
    let date = new Date(year, month, 0);
    return date.getDate();
  }

  function addSpplie(spplieValue){
    let supplier = parseFloat(spplieValue.toFixed(2));
    let calcSupplier = supplier / priceCurrentValue
    value +=  parseFloat(calcSupplier.toFixed(2));
  }  

  function removeSpent(spentValue){
    let spent = parseFloat(spentValue.toFixed(2)) ;
    let calcSpent = spent / consumeKm ;
    value -= parseFloat(calcSpent.toFixed(2))
  }

  function reconstructDate(day,month,year){
    if(Number(day) < 10)
    {
      day = '0'+Number(day);
    }
    if(Number(month) < 10){
      month = '0'+Number(month);
    }
    return `${day}/${month}/${year}`.toString();
  }

  async function sendResult(result){
    const resultResponse = await api.post(`/check?id=${id}`,result);
    console.log(resultResponse.data);
  }
  
  let priceCurrentValue = 0
  let consumeKm= 12;
  let value = 0;
  let day = 0;
  let stop = false;
  let [firstday,firstMonth,firstYear] = minorDate.split('/');
  let [lastday,lastMonth,lastYear] = majorDate.split('/');

  for(let year = firstYear; year <= lastYear; year++ )
  {
    for(let month = firstMonth; month <= 12; month ++){

      for(day = firstday; day <= daysInMonth(month,year); day++ ){
        const currentDate = reconstructDate(day,month,year);
        const priceInDate = prices.find(price => price.date == currentDate);
        if(priceInDate){
          priceCurrentValue = parseFloat(priceInDate.value.toFixed(2));
          
        }

        const supplieInDate = supplies.find(supplie => supplie.date == currentDate);
        if(supplieInDate){
          addSpplie(supplieInDate.value)  
        }

        const spentsInDate = spents.find(spent => spent.date == currentDate)
        if(spentsInDate){
          removeSpent(spentsInDate.value)
        }

        result.push({
          date:currentDate,
          value:parseFloat(value.toFixed(2)),
        })
        
        const lastDate = reconstructDate(lastday,lastMonth,lastYear);
        if(currentDate == lastDate)
        {
          stop = true;
          break
        }
      }
      if(stop){
        break;
      }
      firstday =1;
    }
    firstMonth =1;
  }

  sendResult(result)
}

app();