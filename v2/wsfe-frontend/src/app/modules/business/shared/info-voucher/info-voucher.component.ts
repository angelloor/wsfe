import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Voucher } from '../../voucher/voucher.types';
import { InfoVoucherService } from './info-voucher.service';

@Component({
  selector: 'app-info-voucher',
  templateUrl: './info-voucher.component.html',
})
export class InfoVoucherComponent implements OnInit {
  voucher!: Voucher;

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _infoVoucherService: InfoVoucherService
  ) {}

  ngOnInit(): void {
    this.voucher = this._data.voucher;
  }
  /**
   * closeInfoVoucher
   */
  closeInfoVoucher(): void {
    this._infoVoucherService.closeInfoVoucher();
  }
}
