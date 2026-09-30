import { google } from 'googleapis';

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const grade = searchParams.get('grade') || '3';
  const groupParam = searchParams.get('group') || 'ALL';

  try {
    const sheets = getSheetsClient();
    const spreadsheetId = process.env.SPREADSHEET_ID;
    
    const range = `${grade}학년_경기일정!A2:F`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    const result = [];

    for (let i = 0; i < rows.length; i++) {
      const group = rows[i][0] || 'A';
      if (groupParam === 'ALL' || group === groupParam) {
        result.push({
          rowIdx: i + 2,
          group: group,
          date: rows[i][1] || '',
          match1: rows[i][2] || '',
          match2: rows[i][3] || '',
          location: rows[i][4] || '강당',
          note: rows[i][5] || ''
        });
      }
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}