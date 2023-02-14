import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(
    @Inject(DOCUMENT)
    private document: Document,
  ) {}

  public postRedirect(params: any) {
    const form = this.document.createElement('form')
    form.method = 'POST'
    form.target = '_top'
    form.action = 'https://autodev-join.slatesuper.com.au/confirm'
    // form.setAttribute("method", "POST");
    // form.setAttribute("target", "_top");
    // form.setAttribute(
    //   "action",
    //   "https://autodev-join.slatesuper.com.au/confirm"
    // );
    for (const prop in params) {
      const input = this.document.createElement('input')
      input.type = 'hidden'
      input.name = prop
      input.value = params[prop]
      // input.setAttribute("type", "hidden");
      // input.setAttribute("name", prop);
      // input.setAttribute("value", params[prop]);
      form.append(input)
    }
    this.document.body.appendChild(form)
    form.submit()
  }
}
