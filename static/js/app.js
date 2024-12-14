// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const sampleMetadata = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata
    panel.html("");

    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}


// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const sampleData = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = sampleData.otu_ids;
    const otuLabels = sampleData.otu_labels;
    const sampleValues = sampleData.sample_values;

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    };

    const bubbleLayout = {
      title: `Bubble Chart for Sample ${sample}`,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value" },
      showlegend: false
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const top10OtuIds = otuIds.slice(0, 10).map(id => `OTU ${id}`);
    const top10SampleValues = sampleValues.slice(0, 10).reverse();
    const top10OtuLabels = otuLabels.slice(0, 10);

    // Build a Bar Chart
    const barTrace = {
      x: top10SampleValues,
      y: top10OtuIds,
      text: top10OtuLabels,
      type: "bar",
      orientation: "h"
    };

    const barLayout = {
      title: `Top 10 OTUs for Sample ${sample}`,
      xaxis: { title: "Sample Value" },
      yaxis: { title: "OTU ID" }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [barTrace], barLayout);
  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field (sample IDs)
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();

