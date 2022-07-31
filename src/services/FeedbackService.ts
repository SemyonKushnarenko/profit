import { IFeedback } from "../interfaces/feedback-interface";

export class FeedbackService {
  url = 'http://localhost:3002/feedbacks';
  async sendData(formData: IFeedback) {
    return await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(res => {
      if (res.status === 201) {
        return 'success'
      }
      return 'error'
    })
  }
}