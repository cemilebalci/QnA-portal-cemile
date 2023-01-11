import { Soru } from 'src/app/models/Soru';
import { Cevap } from './../../models/Cevap';
import { Component, OnInit } from '@angular/core';
import { FbservisService } from 'src/app/services/fbservis.service';
import { FormGroup, FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';



@Component({
  selector: 'app-cevap',
  templateUrl: './cevap.component.html',
  styleUrls: ['./cevap.component.css']
})

export class CevapComponent implements OnInit {
  mevcutCevaplar: Cevap[] = [];
  eskiCevaplar: Cevap[] = [];
  mevcutSorular: Soru [] = [];
  soru:any;
  frm: FormGroup = new FormGroup({
    baslik: new FormControl(),
    soru: new FormControl(),
    cevap: new FormControl(),
    eklemetarih: new FormControl(),
    tamam: new FormControl()
  });
soruId: any;
  constructor(
    public fbservis: FbservisService,
    public htoast: HotToastService
  ) { }

  ngOnInit() {
    this.CevapListele();
    this.fbservis.aktifUye.subscribe(d => {
      console.log(d);
    });
  }
  CevapListele() {
    this.fbservis.CevapListele().subscribe(d => {
      this.mevcutCevaplar = d.filter(s => s.tamam == false || s.tamam == null);
      this.eskiCevaplar = d.filter(s => s.tamam == true);
    });
  }
  SecSoru() {
    this.fbservis.SoruListele().subscribe(d => {
    });
    
  }
  CevapEkle() {
    // console.log(this.frm.value);
    this.fbservis.CevapEkle(this.frm.value)
      .pipe(
        this.htoast.observe({
          success: 'Cevap Eklendi',
          loading: 'Cevap Ekleniyor...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe();
  }
  Sil(cevap: Cevap) {
    this.fbservis.CevapSil(cevap).then(() => {

    });
  }
  CevapDuzenle(cevap: Cevap) {
    this.fbservis.CevapDuzenle(cevap).then(() => {

    });
  }
}
