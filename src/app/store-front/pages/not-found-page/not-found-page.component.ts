import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  templateUrl: './not-found-page.component.html',
  host: { class: 'flex-1 flex flex-col' },
})
export default class NotFoundPageComponent { }
