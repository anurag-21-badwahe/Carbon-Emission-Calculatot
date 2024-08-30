function calculateEmissions(
    machineTypes,
    coalType,
    coalQuantity,
    electricity,
    diesel,
    otherFuel,
    methaneContent,
    methaneCapture,
    transportModes,
    distances,
    fuelEfficiencies,
    fuelTypes
  ) {
    let totalEmissions = 0;
  
    // Coal extraction emissions
    const coalEmissionFactors = {
      anthracite: 2.62,
      bituminous: 2.46,
      subbituminous: 1.98,
      lignite: 1.36
    };
    totalEmissions += coalQuantity * coalEmissionFactors[coalType];
  
    // Electricity emissions (assuming average grid emissions of 0.5 kg CO2e/kWh)
    totalEmissions += electricity * 0.0005;
  
    // Diesel emissions (2.68 kg CO2e/liter)
    totalEmissions += diesel * 0.00268;
  
    // Methane emissions
    let methaneEmissions = coalQuantity * (methaneContent / 100) * 25; // GWP of methane is 25
    if (methaneCapture === 'yes') {
      methaneEmissions *= 0.2; // Assume 80% capture rate
    }
    totalEmissions += methaneEmissions;
  
    // Transportation emissions
    for (let i = 0; i < transportModes.length; i++) {
      let transportEmissions = 0;
      const distance = parseFloat(distances[i]);
      const efficiency = parseFloat(fuelEfficiencies[i]);
  
      if (fuelTypes[i] === 'diesel') {
        transportEmissions = (distance / efficiency) * 0.00268; // 2.68 kg CO2e/liter
      } else if (fuelTypes[i] === 'gasoline') {
        transportEmissions = (distance / efficiency) * 0.00233; // 2.33 kg CO2e/liter
      } else if (fuelTypes[i] === 'electric') {
        transportEmissions = (distance / efficiency) * 0.0005; // 0.5 kg CO2e/kWh
      }
  
      totalEmissions += transportEmissions;
    }
  
    // Machine emissions (simplified, assuming diesel usage)
    machineTypes.forEach((machine, index) => {
      const count = parseInt(document.getElementsByName('machineCount[]')[index].value);
      const hours = parseFloat(document.getElementsByName('operationalHours[]')[index].value);
      const fuelConsumption = 15; // Assume 15 L/hour for simplicity
      totalEmissions += count * hours * fuelConsumption * 0.00268 * 365; // Assuming year-round operation
    });
  
    return totalEmissions;
  }
  
  document.getElementById("carbonEmissionForm").addEventListener("submit", function (event) {
    event.preventDefault();
    // Get input values
    var machineTypes = Array.from(document.getElementsByName("machineType[]")).map((el) => el.value);
    var coalType = document.getElementById("coalType").value;
    var coalQuantity = parseFloat(document.getElementById("coalQuantity").value);
    var electricity = parseFloat(document.getElementById("electricity").value);
    var diesel = parseFloat(document.getElementById("diesel").value);
    var otherFuel = document.getElementById("otherFuel").value;
    var methaneContent = parseFloat(document.getElementById("methaneContent").value);
    var methaneCapture = document.getElementById("methaneCapture").value;
    var transportModes = Array.from(document.getElementsByName("transportMode[]")).map((el) => el.value);
    var distances = Array.from(document.getElementsByName("transportDistance[]")).map((el) => el.value);
    var fuelEfficiencies = Array.from(document.getElementsByName("fuelEfficiency[]")).map((el) => el.value);
    var fuelTypes = Array.from(document.getElementsByName("fuelType[]")).map((el) => el.value);
    var numPeople = parseInt(document.getElementById("numPeople").value);
  
    // Calculate emissions
    var totalEmissions = calculateEmissions(
      machineTypes,
      coalType,
      coalQuantity,
      electricity,
      diesel,
      otherFuel,
      methaneContent,
      methaneCapture,
      transportModes,
      distances,
      fuelEfficiencies,
      fuelTypes
    );
  
    var perCapitaEmissions = totalEmissions / numPeople;


      
  
    // Display results
    document.getElementById("result").innerHTML = `
      Total Carbon Emissions: ${totalEmissions.toFixed(2)} tons CO2e<br>
      Per Capita Emissions: ${perCapitaEmissions.toFixed(2)} tons CO2e per person
    `;
  });

  let transportCount = 1; 
  function addTransportation() {
    // Get the transportationList div
    const transportationList = document.getElementById('transportationList');
    
    // Clone the first transportation entry
    const transportEntry = transportationList.querySelector('.transportEntry').cloneNode(true);
    
    // Clear the input values in the cloned entry
    transportEntry.querySelectorAll('input').forEach(input => input.value = '');
    transportEntry.querySelectorAll('select').forEach(select => select.value = '');
    
    // Create a <br> element
    const br = document.createElement('br');
    
    // Create a sequence label
    const sequenceLabel = document.createElement('h3');
    sequenceLabel.textContent = `Transportation Method ${++transportCount}`;
    
    // Append the <br> element before the cloned entry
    transportationList.appendChild(br);
  
    // Append the sequence label before the cloned entry
    transportationList.appendChild(sequenceLabel);
  
    // Append the cloned entry to the transportationList div
    transportationList.appendChild(transportEntry);
  }

  let equipmentCount = 1;

  function addMachine() {
    // Get the machineList div
    const machineList = document.getElementById('machineList');
    
    // Clone the first machine entry
    const machineEntry = machineList.querySelector('.machineEntry').cloneNode(true);
    
    // Clear the input values in the cloned entry
    machineEntry.querySelectorAll('input').forEach(input => input.value = '');
    machineEntry.querySelectorAll('select').forEach(select => select.value = '');
    
    // Create a <br> element
    const br = document.createElement('br');
    
    // Create a sequence label
    const sequenceLabel = document.createElement('h3');
    sequenceLabel.textContent = `Machine Entry ${++equipmentCount}`;
    
    // Append the <br> element before the cloned entry
    machineList.appendChild(br);
    
    // Append the sequence label before the cloned entry
    machineList.appendChild(sequenceLabel);
    
    // Append the cloned entry to the machineList div
    machineList.appendChild(machineEntry);
  }
  