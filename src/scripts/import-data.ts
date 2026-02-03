#!/usr/bin/env ts-node
import connectDB from '../lib/db/mongoose';
import { Component } from '../lib/db/models';
import componentsData from '../lib/data/components.json';

async function importData() {
  try {
    await connectDB();
    
    console.log('Clearing existing data...');
    await Component.deleteMany({});
    
    console.log(`Importing ${componentsData.length} components...`);
    
    // 添加时间戳
    const dataWithTimestamps = componentsData.map(c => ({
      ...c,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    await Component.insertMany(dataWithTimestamps);
    
    console.log('Data imported successfully!');
    
    // 统计
    const count = await Component.countDocuments();
    console.log(`Total components: ${count}`);
    
    const categories = await Component.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('\nCategories:');
    categories.forEach((c: { _id: string; count: number }) => {
      console.log(`  ${c._id}: ${c.count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importData();
