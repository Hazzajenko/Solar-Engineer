import { Component } from '@angular/core'
import * as atlas from 'azure-maps-control'
import * as service from 'azure-maps-rest'

@Component({
  selector:    'app-maps-quick-start',
  templateUrl: 'maps-quick-start.component.html',
  styleUrls:   ['maps-quick-start.component.css'],
  standalone:  true,
})

export class MapsQuickStartComponent {
  map!: atlas.Map
  datasource!: atlas.source.DataSource
  client: any
  popup!: atlas.Popup
  searchInput!: HTMLElement
  resultsPanel!: HTMLElement
  searchInputLength: any
  centerMapOnResults: any
  minSearchInputLength = 3
  keyStrokeDelay = 150

  getMap() {
    //Initialize a map instance.
    // service.
    // atlas.

    this.map = new atlas.Map('myMap', {
      // center: [-118.270293, 34.039737],
      // zoom:   14,
      view: 'Auto',

      //Add authentication details for connecting to Azure Maps.
      authOptions: {

        //Use Azure Active Directory authentication.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        authType: 'subscriptionKey',
        /*        clientId:        'bd14510f-7394-481e-bec1-d2d43168cb75', //Your Azure Maps client id for accessing your Azure Maps account.
         getToken:        function(resolve, reject, map) {
         //URL to your authentication service that retrieves an Azure Active Directory Token.
         const tokenServiceUrl = 'https://samples.azuremaps.com/api/GetAzureMapsToken'

         fetch(tokenServiceUrl)
         .then(r => r.text())
         .then(token => resolve(token))
         },*/

        //Alternatively, use an Azure Maps key. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
        //authType: 'subscriptionKey',
        //subscriptionKey: '[YOUR_AZURE_MAPS_KEY]'
      },
    })

    //Store a reference to the Search Info Panel.

    const resultsPanel = document.getElementById('results-panel')
    if (!resultsPanel) {
      throw new Error('resultsPanel is undefined')
    }
    this.resultsPanel = resultsPanel

    //Add key up event to the search box.
    const searchInput = document.getElementById('search-input')
    if (!searchInput) {
      throw new Error('searchInput is undefined')
    }
    this.searchInput = searchInput
    this.searchInput.addEventListener('keyup', this.searchInputKeyup)

    //Create a popup which we can reuse for each result.
    this.popup = new atlas.Popup()

    //Wait until the map resources are ready.
    this.map.events.add('ready', () => {
      const map = this.map
      //Add the zoom control to the map.
      // const position: atlas.ControlPosition =

      map.controls.add(new atlas.control.ZoomControl(), {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        position: 'top-right',
      })

      //Create a data source and add it to the map.
      this.datasource = new atlas.source.DataSource()
      map.sources.add(this.datasource)

      //Add a layer for rendering the results.
      const searchLayer = new atlas.layer.SymbolLayer(this.datasource, undefined, {
        iconOptions: {
          image:        'pin-round-darkblue',
          anchor:       'center',
          allowOverlap: true,
        },
      })
      map.layers.add(searchLayer)

      //Add a click event to the search layer and show a popup when a result is clicked.
      map.events.add('click', searchLayer, (e) => {
        //Make sure the event occurred on a shape feature.
        if (e.shapes && e.shapes.length > 0) {
          // this.popup.
          this.showPopup(e.shapes[0])
        }
      })
    })
  }

  searchInputKeyup(e: {
    keyCode: number
  }) {
    this.centerMapOnResults = false
    if ((this.searchInput as any).value.length >= this.minSearchInputLength) {
      if (e.keyCode === 13) {
        this.centerMapOnResults = true
      }
      //Wait 100ms and see if the input length is unchanged before performing a search.
      //This will reduce the number of queries being made on each character typed.
      setTimeout(() => {
        if (this.searchInputLength == (this.searchInput as any).value.length) {
          this.search()
        }
      }, this.keyStrokeDelay)
    } else {
      this.resultsPanel.innerHTML = ''
    }
    this.searchInputLength = (this.searchInput as any).value.length
  }

  search() {
    //Remove any previous results from the map.
    this.datasource.clear()
    this.popup.close()
    this.resultsPanel.innerHTML = ''

    //Use MapControlCredential to share authentication between a map control and the service module.
    const pipeline = service.MapsURL.newPipeline(new service.MapControlCredential(this.map))

    //Construct the SearchURL object
    const searchURL = new service.SearchURL(pipeline)

    const searchInput = document.getElementById('search-input')
    if (!searchInput) {
      throw new Error('searchInput is undefined')
    }
    const query = (searchInput as any).value

    const camera = this.map.getCamera().center
    if (!camera) {
      throw new Error('camera is undefined')
    }

    const cameraLon = camera[0]
    const cameraLat = camera[1]

    // const cameraLon = this.map.getCamera().center[0];

    // const cameraLat = this.map.getCamera().center[1];
    searchURL.searchPOI(service.Aborter.timeout(10000), query, {
      lon:           cameraLon,
      lat:           cameraLat,
      maxFuzzyLevel: 4,
      view:          'Auto',
    })
      .then((results) => {

        //Extract GeoJSON feature collection from the response and add it to the datasource
        const data = results.geojson.getFeatures()
        this.datasource.add(data)

        if (this.centerMapOnResults) {
          this.map.setCamera({
            bounds: data.bbox,
          })
        }
        console.log(data)
        //Create the HTML for the results list.
        const html = []
        for (let i = 0; i < data.features.length; i++) {
          const r = data.features[i]
          if (!r.properties) {
            continue
          }
          // const isPoiDefined = r.properties['poi']
          html.push('<li onclick="itemClicked(\'', r.id, '\')" onmouseover="itemHovered(\'', r.id, '\')">')
          html.push('<div class="title">')
          if (r.properties && r.properties['poi'] && r.properties['poi'].name) {
            html.push(r.properties['poi'].name)
          } else {
            if (r.properties && r.properties['address'] && r.properties['address'].freeformAddress) {
              const address = r.properties['address'].freeformAddress
              html.push(address)

            }
            // html.concat(r.properties?['address'].freeformAddress)
          }
          html.push('</div><div class="info">', r.properties['type'], ': ', r.properties['address'].freeformAddress, '</div>')
          if (r.properties['poi']) {
            if (r.properties['phone']) {
              html.push('<div class="info">phone: ', r.properties['poi'].phone, '</div>')
            }
            if (r.properties['poi'].url) {
              html.push('<div class="info"><a href="http://', r.properties['poi'].url, '">http://', r.properties['poi'].url, '</a></div>')
            }
          }
          html.push('</li>')
          this.resultsPanel.innerHTML = html.join('')
        }

      })
  }

  itemHovered(id: string | number) {
    //Show a popup when hovering an item in the result list.
    const shape = this.datasource.getShapeById(id)
    this.showPopup(shape)
  }

  itemClicked(id: string | number) {
    //Center the map over the clicked item from the result list.
    const shape = this.datasource.getShapeById(id)
    this.map.setCamera({
      center: shape.getCoordinates(),
      zoom:   17,
    })
  }

  showPopup(shape: any) {
    const properties = shape.getProperties()
    //Create the HTML content of the POI to show in the popup.
    const html = ['<div class="poi-box">']
    //Add a title section for the popup.
    html.push('<div class="poi-title-box"><b>')

    if (properties.poi && properties.poi.name) {
      html.push(properties.poi.name)
    } else {
      html.push(properties.address.freeformAddress)
    }
    html.push('</b></div>')
    //Create a container for the body of the content of the popup.
    html.push('<div class="poi-content-box">')
    html.push('<div class="info location">', properties.address.freeformAddress, '</div>')
    if (properties.poi) {
      if (properties.poi.phone) {
        html.push('<div class="info phone">', properties.phone, '</div>')
      }
      if (properties.poi.url) {
        html.push('<div><a class="info website" href="http://', properties.poi.url, '">http://', properties.poi.url, '</a></div>')
      }
    }
    html.push('</div></div>')
    this.popup.setOptions({
      position: shape.getCoordinates(),
      content:  html.join(''),
    })
    this.popup.open(this.map)
  }
}