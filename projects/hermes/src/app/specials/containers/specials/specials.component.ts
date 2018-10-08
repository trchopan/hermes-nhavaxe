import { Component, OnInit } from '@angular/core';
import { SpecialsService } from '@app/app/specials/services/specials.service';

@Component({
  selector: 'hm-specials',
  templateUrl: './specials.component.html',
  styleUrls: ['./specials.component.scss']
})
export class SpecialsComponent implements OnInit {

  constructor(public specials: SpecialsService) { }

  ngOnInit() {
  }

}
