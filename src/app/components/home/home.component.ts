import { HotToastService } from '@ngneat/hot-toast';
import { Soru } from 'src/app/models/Soru';
import { FbservisService } from './../../services/fbservis.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mevcutSorular: Soru[] = [];
  eskiSorular: Soru[] = [];
  frm: FormGroup = new FormGroup({
    baslik: new FormControl(),
    soru: new FormControl(),
    etiket: new FormControl(),
    tamam: new FormControl()
  });
  constructor(
    public fbservis: FbservisService,
    public htoast: HotToastService
  ) { }

  ngOnInit() {
    this.SoruListele();
    this.fbservis.aktifUye.subscribe(d => {
      console.log(d);
    });
  }
  SoruListele() {
    this.fbservis.SoruListele().subscribe(d => {
      this.mevcutSorular = d.filter(s => s.tamam == false || s.tamam == null);
      this.eskiSorular = d.filter(s => s.tamam == true);
    });
  }
  Kaydet() {
    // console.log(this.frm.value);
    this.fbservis.SoruEkle(this.frm.value)
      .pipe(
        this.htoast.observe({
          success: 'Soru Eklendi',
          loading: 'Soru Ekleniyor...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe();
  }
  Sil(soru: Soru) {
    this.fbservis.SoruSil(soru).then(() => {

    });
  }
  TamamIptal(soru: Soru, d: boolean) {
    soru.tamam = d;
    this.fbservis.SoruDuzenle(soru).then(() => {

    });
  }
}
