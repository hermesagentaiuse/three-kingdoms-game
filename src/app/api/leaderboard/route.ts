import { NextResponse } from 'next/server';
import {
  readServerLeaderboard,
  addServerLeaderboardEntry,
  getServerLeaderboardStats,
  type ServerLeaderboardEntry,
} from '@/lib/leaderboard-server';

/** GET /api/leaderboard — 取得伺服器端排行榜 */
export async function GET() {
  try {
    const board = readServerLeaderboard();
    const stats = getServerLeaderboardStats();
    return NextResponse.json({ success: true, data: board, stats });
  } catch (err) {
    console.error('[API /leaderboard] GET error:', err);
    return NextResponse.json({ success: false, message: '取得排行榜失敗' }, { status: 500 });
  }
}

/** POST /api/leaderboard — 新增伺服器端排行榜紀錄 */
export async function POST(request: Request) {
  try {
    const body: ServerLeaderboardEntry = await request.json();

    if (!body.id || !body.name) {
      return NextResponse.json({ success: false, message: '缺少必要欄位' }, { status: 400 });
    }

    const board = addServerLeaderboardEntry(body);
    const stats = getServerLeaderboardStats();
    return NextResponse.json({ success: true, data: board, stats });
  } catch (err) {
    console.error('[API /leaderboard] POST error:', err);
    return NextResponse.json({ success: false, message: '新增失敗' }, { status: 500 });
  }
}
