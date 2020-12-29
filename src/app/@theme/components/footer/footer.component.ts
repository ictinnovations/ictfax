import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
  <span class="created-by">
  Developed by <b><a href="http://ictfax.org" target="_blank">Fiza Khan</a></b> Copyright ICT Innovations 2020, all right reserved
  </span>
  <div class="socials">
    <a href="https://github.com/ictinnovations/ictfax" target="_blank" class="ion ion-social-github"></a>
    <a href="https://www.facebook.com/ICTInnovations/" target="_blank" class="ion ion-social-facebook"></a>
    <a href="https://twitter.com/tahiralmas" target="_blank" class="ion ion-social-twitter"></a>
    <a href="https://pk.linkedin.com/company/ict-innovations" target="_blank" class="ion ion-social-linkedin"></a>
  </div>
  `,
})
export class FooterComponent {
}
