import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interactive-map',
  templateUrl: './interactive-map.component.html',
  styleUrls: ['./interactive-map.component.css']
})
export class InteractiveMapComponent implements OnInit {

  regionStats: { [key: string]: any } = {
    US: { name: "United States", species: 1800, endangered: 230, featured: "Bald Eagle" },
    BR: { name: "Brazil", species: 7000, endangered: 980, featured: "Jaguar" },
    IN: { name: "India", species: 4200, endangered: 850, featured: "Bengal Tiger" },
    ID: { name: "Indonesia", species: 3500, endangered: 770, featured: "Orangutan" },
    ZA: { name: "South Africa", species: 3900, endangered: 320, featured: "African Elephant" },
    AU: { name: "Australia", species: 5200, endangered: 1100, featured: "Koala" }
    // Add more countries with ISO codes
  };

  ngOnInit(): void {
    // Load the map once the DOM is ready
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = 'assets/worldmap/worldmap.js';
      document.body.appendChild(script);

      (window as any).simplemaps_worldmap_mapdata = {
        main_settings: {
          border_color: "#FFFFFF",
          background_color: "#fdf6ee",
          popup_color: "#fff",
          popup_opacity: 0.95,
          popup_shadow: 1,
          label_color: "#333",
          label_hover_color: "#000",
          region_hover_color: "#a57c55",
          region_color: "#ccb89a",
          all_regions_inactive: false,
          all_regions_zoomable: false
        },
        state_specific: this.buildStateData(),
        locations: [],
        labels: {},
        regions: {},
        data: {}
      };
    }, 0);
  }

  buildStateData(): any {
    const states: any = {};
    for (const [code, data] of Object.entries(this.regionStats)) {
      states[code] = {
        name: data.name,
        description: `<strong>${data.featured}</strong><br/>Species: ${data.species}<br/>Endangered: ${data.endangered}`
      };
    }
    return states;
  }
}
