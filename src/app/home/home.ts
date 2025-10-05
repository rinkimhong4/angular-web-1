import { Component } from '@angular/core';
import { HeroSection } from '../hero-section/hero-section';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [HeroSection],
})
export class Home {}
